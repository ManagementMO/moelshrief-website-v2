import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { MeshDistortMaterial, GradientTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Heart shape geometry
const HeartShape = () => {
  const heartShape = new THREE.Shape();
  
  // Heart curve definition
  const x = 0, y = 0;
  heartShape.moveTo(x, y);
  heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 5, y, x + 5, y + 2.5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 2.5, y + 7.5, x, y + 10);
  heartShape.bezierCurveTo(x - 2.5, y + 7.5, x - 5, y + 5, x - 5, y + 2.5);
  heartShape.bezierCurveTo(x - 5, y, x - 2.5, y + 2.5, x, y);
  
  const extrudeSettings = {
    depth: 2,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.5,
    bevelThickness: 0.5
  };
  
  return (
    <extrudeGeometry args={[heartShape, extrudeSettings]} />
  );
};

// Animated heart component
const AnimatedHeart = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [pulsing, setPulsing] = useState(true);
  
  // Spring animation for heart beat
  const { scale, rotation, distort } = useSpring({
    scale: pulsing ? [1.1, 1.1, 1.1] : [1, 1, 1],
    rotation: [0, clicked ? Math.PI : 0, 0],
    distort: hovered ? 0.4 : 0.2,
    config: {
      mass: 2,
      tension: 300,
      friction: 10,
    },
  });
  
  // Continuous animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t / 2) * 0.3;
    meshRef.current.rotation.z = Math.sin(t / 4) * 0.1;
  });
  
  // Toggle pulsing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsing(prev => !prev);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <animated.mesh
      ref={meshRef}
      scale={scale}
      rotation={rotation}
      position={[0, 0, 0]}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <HeartShape />
      <animated.meshPhysicalMaterial
        color="#ff0066"
        emissive="#ff0066"
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.2}
        thickness={1}
        distort={distort}
      />
    </animated.mesh>
  );
};

// Glowing particles around the heart
const HeartParticles = ({ count = 20 }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return positions;
  });
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const t = state.clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Circular motion
      const angle = Math.atan2(y, x) + 0.01;
      const radius = Math.sqrt(x * x + y * y);
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = z + Math.sin(t + i) * 0.02;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#ff6699"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Main component
const GlowingHeart3D: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <div style={{ width: size, height: size, display: 'inline-block' }}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={40} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff6699" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff3366" />
        
        <AnimatedHeart />
        <HeartParticles />
        
        {/* Glow effect */}
        <mesh position={[0, 0, -1]} scale={[15, 15, 1]}>
          <planeGeometry />
          <meshBasicMaterial
            color="#ff0066"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export default GlowingHeart3D;