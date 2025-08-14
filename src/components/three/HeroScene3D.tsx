import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/hooks/use-theme';

interface HeroScene3DProps {
  strength?: number;
  scale?: number;
  speed?: number;
  profileImage?: string;
}

const AnimatedPhotoSphere = ({ strength = 0.3, scale = 1.5, speed = 0.3, profileImage = "/images/profile.jpg" }: HeroScene3DProps) => {
  const theme = useTheme();
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  
  // Create animated material colors based on theme
  const materialProps = {
    color: new THREE.Color(`hsl(${theme.primaryHue}, ${theme.primarySaturation}%, ${theme.primaryLightness}%)`),
    distort: hovered ? strength * 1.5 : strength,
    speed: 1.5,
    roughness: 0.2,
  };
  
  useFrame(({ clock, mouse }) => {
    if (!sphereRef.current) return;
    
    const t = clock.getElapsedTime() * speed;
    
    // Base rotation animation
    sphereRef.current.rotation.x = Math.sin(t / 2) * 0.3;
    sphereRef.current.rotation.y = Math.sin(t / 3) * 0.3;
    
    // Interactive rotation based on mouse position when hovered
    if (hovered) {
      sphereRef.current.rotation.x += (mouse.y * 0.5 - sphereRef.current.rotation.x) * 0.1;
      sphereRef.current.rotation.y += (mouse.x * 0.5 - sphereRef.current.rotation.y) * 0.1;
    }
    
    // Subtle pulsing
    const pulseScale = scale + (hovered ? Math.sin(t * 2) * 0.1 : Math.sin(t) * 0.05);
    sphereRef.current.scale.set(pulseScale, pulseScale, pulseScale);
  });
  
  return (
    <Sphere 
      ref={sphereRef} 
      args={[1, 64, 64]} 
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial 
        color={materialProps.color}
        attach="material"
        distort={materialProps.distort}
        speed={materialProps.speed}
        roughness={materialProps.roughness}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
};

export const HeroScene3D = (props: HeroScene3DProps) => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.4}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="purple" />
        
        <AnimatedPhotoSphere {...props} />
        
        <fog attach="fog" color="#050816" near={3} far={8} />
      </Canvas>
    </div>
  );
};
