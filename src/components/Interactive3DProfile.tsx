import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { OrbitControls, PerspectiveCamera, useTexture, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Frame component with physics-based interaction
const Frame = ({ texture, pressed, setPressed }) => {
  const mesh = useRef();
  const { viewport } = useThree();
  
  // Spring animation for pressing effect
  const { position, scale, rotation } = useSpring({
    position: pressed ? [0, 0, -0.2] : [0, 0, 0],
    scale: pressed ? 0.95 : 1,
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 280, friction: 60 }
  });

  // Spring animation for hover effect
  const [hovered, setHovered] = useState(false);
  const hoverSpring = useSpring({
    color: hovered ? '#ffffff' : '#aaaaaa',
    emissive: hovered ? '#333333' : '#111111',
    config: { mass: 1, tension: 280, friction: 60 }
  });

  // Handle mouse interaction
  const handlePointerDown = () => {
    setPressed(true);
  };

  const handlePointerUp = () => {
    setPressed(false);
  };

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  // Subtle continuous animation
  useFrame((state) => {
    if (!pressed) {
      const time = state.clock.getElapsedTime();
      mesh.current.rotation.x = Math.sin(time / 4) * 0.03;
      mesh.current.rotation.y = Math.sin(time / 3) * 0.03;
    }
  });

  return (
    <animated.group
      position={position}
      scale={scale}
    >
      {/* Frame */}
      <animated.mesh
        ref={mesh}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3, 4, 0.2]} />
        <animated.meshStandardMaterial
          color={hoverSpring.color}
          emissive={hoverSpring.emissive}
          metalness={0.8}
          roughness={0.2}
        />
      </animated.mesh>

      {/* Photo - filling the entire frame with proper aspect ratio */}
      <animated.mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[2.9, 3.9]} />
        <meshStandardMaterial 
          map={texture} 
          toneMapped={false}
        />
      </animated.mesh>

      {/* Glass cover */}
      <animated.mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[2.9, 3.9]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.2}
          roughness={0}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={0.5}
        />
      </animated.mesh>
    </animated.group>
  );
};

// Particles floating around the frame
const Particles = ({ count = 50 }) => {
  const mesh = useRef();
  const particles = useRef([]);

  useEffect(() => {
    // Initialize particles with random positions and velocities
    particles.current = Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ],
      velocity: [
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ],
      size: Math.random() * 0.05 + 0.02
    }));
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;

    const positions = mesh.current.geometry.attributes.position.array;
    const sizes = mesh.current.geometry.attributes.size.array;

    // Update particle positions based on velocity
    particles.current.forEach((particle, i) => {
      const idx = i * 3;
      
      // Update position
      particle.position[0] += particle.velocity[0];
      particle.position[1] += particle.velocity[1];
      particle.position[2] += particle.velocity[2];
      
      // Boundary check and bounce
      [0, 1, 2].forEach(axis => {
        if (Math.abs(particle.position[axis]) > 5) {
          particle.velocity[axis] *= -1;
        }
      });
      
      // Update geometry
      positions[idx] = particle.position[0];
      positions[idx + 1] = particle.position[1];
      positions[idx + 2] = particle.position[2];
      sizes[i] = particle.size;
    });

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={new Float32Array(count)}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Main component
const Interactive3DProfile = ({ imagePath = "/images/profile.jpg" }) => {
  const [pressed, setPressed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="w-full h-full rounded-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas shadows dpr={[1, 2]} className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.7} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
        
        <TexturedFrame imagePath={imagePath} pressed={pressed} setPressed={setPressed} />
        
        <Environment preset="city" />
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.5}
          scale={10}
          blur={1}
          far={5}
          resolution={256}
        />
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Instruction overlay */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-xs pointer-events-none">
        <p>Drag to rotate • Click to press</p>
      </div>
    </motion.div>
  );
};

// Component that loads the texture
const TexturedFrame = ({ imagePath, pressed, setPressed }) => {
  const texture = useTexture(imagePath);
  return <Frame texture={texture} pressed={pressed} setPressed={setPressed} />;
};

export default Interactive3DProfile;