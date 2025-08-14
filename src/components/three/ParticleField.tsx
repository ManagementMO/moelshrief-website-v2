import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Point, Points } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/hooks/use-theme';

interface ParticleFieldProps {
  count?: number;
  size?: number;
  color?: string;
  threshold?: number;
}

export const ParticleField = ({
  count = 2000,
  size = 0.02,
  threshold = 0.5
}: ParticleFieldProps) => {
  const theme = useTheme();
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random positions with useMemo for optimization
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 8;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const t = state.clock.getElapsedTime() * 0.1;
    pointsRef.current.rotation.set(
      Math.sin(t / 4) * 0.3,
      Math.sin(t / 4) * 0.2,
      Math.cos(t / 4) * 0.1
    );
    
    // Subtle pulsing
    const scale = 1 + Math.sin(t) * 0.01;
    pointsRef.current.scale.set(scale, scale, scale);
  });

  // Colors from our theme
  const primaryColor = useMemo(() => new THREE.Color("hsl(268, 92%, 67%)"), []);
  const secondaryColor = useMemo(() => new THREE.Color("hsl(195, 92%, 67%)"), []);

  return (
    <Points 
      ref={pointsRef}
      positions={particles}
      stride={3}
      frustumCulled={false}
    >
      <pointsMaterial
        size={size}
        color={primaryColor} // Use a single theme color for now
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};
