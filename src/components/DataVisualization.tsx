import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number; y: number };
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

interface DataVisualizationProps {
  nodeCount?: number;
  connectionCount?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  nodeCount = 30,
  connectionCount = 40,
  width = 500,
  height = 300,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: -1000, y: -1000 });
  
  // Initialize nodes and connections
  useEffect(() => {
    // Generate random nodes
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
      id: `node-${i}`,
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 2,
      color: getRandomColor(),
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
      },
    }));
    
    // Generate random connections
    const connections: Connection[] = [];
    for (let i = 0; i < connectionCount; i++) {
      const sourceIndex = Math.floor(Math.random() * nodeCount);
      let targetIndex = Math.floor(Math.random() * nodeCount);
      
      // Ensure source and target are different
      while (targetIndex === sourceIndex) {
        targetIndex = Math.floor(Math.random() * nodeCount);
      }
      
      connections.push({
        source: nodes[sourceIndex].id,
        target: nodes[targetIndex].id,
        strength: Math.random() * 0.5 + 0.1,
      });
    }
    
    nodesRef.current = nodes;
    connectionsRef.current = connections;
    
    // Start animation
    startAnimation();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodeCount, connectionCount, width, height]);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    
    const handleMouseLeave = () => {
      mousePositionRef.current = { x: -1000, y: -1000 };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Animation loop
  const startAnimation = () => {
    const animate = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update node positions
      nodesRef.current.forEach(node => {
        // Apply velocity
        node.x += node.velocity.x;
        node.y += node.velocity.y;
        
        // Bounce off walls
        if (node.x < node.radius || node.x > canvas.width - node.radius) {
          node.velocity.x *= -1;
        }
        
        if (node.y < node.radius || node.y > canvas.height - node.radius) {
          node.velocity.y *= -1;
        }
        
        // Mouse interaction
        const dx = mousePositionRef.current.x - node.x;
        const dy = mousePositionRef.current.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 500;
          
          node.velocity.x -= Math.cos(angle) * force;
          node.velocity.y -= Math.sin(angle) * force;
        }
        
        // Apply friction
        node.velocity.x *= 0.99;
        node.velocity.y *= 0.99;
      });
      
      // Draw connections
      ctx.globalAlpha = 0.2;
      connectionsRef.current.forEach(connection => {
        const source = nodesRef.current.find(node => node.id === connection.source);
        const target = nodesRef.current.find(node => node.id === connection.target);
        
        if (!source || !target) return;
        
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only draw connections within a certain distance
        if (distance < 150) {
          const opacity = 1 - distance / 150;
          
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(96, 165, 250, ${opacity * 0.5})`;
          ctx.lineWidth = connection.strength;
          ctx.stroke();
        }
      });
      
      // Draw nodes
      ctx.globalAlpha = 1;
      nodesRef.current.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Draw glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          node.x, node.y, node.radius,
          node.x, node.y, node.radius * 2
        );
        gradient.addColorStop(0, `${node.color}80`);
        gradient.addColorStop(1, `${node.color}00`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  // Helper function to generate random colors
  const getRandomColor = () => {
    const colors = [
      '#60A5FA', // blue
      '#A78BFA', // purple
      '#F472B6', // pink
      '#34D399', // green
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
    </div>
  );
};

export default DataVisualization;