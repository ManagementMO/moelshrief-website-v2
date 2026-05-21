
import { useEffect, useRef } from "react";

const GlowingOrb = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    size: number;
    color: string;
    seed: number;
  }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    size: 500,
    color: "hsl(266, 83%, 75%)",
    seed: Math.random(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial resize
    resizeCanvas();

    // Add event listener for window resize
    window.addEventListener('resize', resizeCanvas);

    // Mouse move event to update target position
    const handleMouseMove = (e: MouseEvent) => {
      orbRef.current.targetX = e.clientX;
      orbRef.current.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation variables
    const orb = orbRef.current;
    orb.x = window.innerWidth / 2;
    orb.y = window.innerHeight / 2;
    orb.targetX = orb.x;
    orb.targetY = orb.y;

    // Animation function
    const animate = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update orb position with smooth easing
      orb.x += (orb.targetX - orb.x) * 0.02;
      orb.y += (orb.targetY - orb.y) * 0.02;
      
      // Draw main glow
      const gradient = ctx.createRadialGradient(
        orb.x, 
        orb.y, 
        0, 
        orb.x, 
        orb.y, 
        orb.size
      );

      // Time-based animation
      const time = Date.now() * 0.001;
      const hue = 266 + Math.sin(time * 0.3) * 10;
      
      gradient.addColorStop(0, `hsla(${hue}, 83%, 75%, 0.4)`);
      gradient.addColorStop(0.5, `hsla(${hue - 20}, 83%, 65%, 0.1)`);
      gradient.addColorStop(1, `hsla(${hue - 40}, 83%, 55%, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
      ctx.fill();

      // Create smaller highlight orbs
      for (let i = 0; i < 3; i++) {
        const angle = time * (0.2 + i * 0.1) + i * Math.PI * 2 / 3;
        const distance = 100 + Math.sin(time * 0.5) * 50;
        const smallX = orb.x + Math.cos(angle) * distance;
        const smallY = orb.y + Math.sin(angle) * distance;
        const smallSize = 100 + Math.sin(time * 0.7 + i) * 30;
        
        const smallGradient = ctx.createRadialGradient(
          smallX, smallY, 0, smallX, smallY, smallSize
        );
        
        const smallHue = (hue + 120 * i) % 360;
        
        smallGradient.addColorStop(0, `hsla(${smallHue}, 83%, 75%, 0.3)`);
        smallGradient.addColorStop(0.5, `hsla(${smallHue}, 83%, 65%, 0.1)`);
        smallGradient.addColorStop(1, `hsla(${smallHue}, 83%, 55%, 0)`);

        ctx.fillStyle = smallGradient;
        ctx.beginPath();
        ctx.arc(smallX, smallY, smallSize, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default GlowingOrb;
