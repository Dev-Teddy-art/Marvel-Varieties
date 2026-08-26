'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveMesh() {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <group ref={meshRef}>
        {/* Core Product Body - Deep Luxury Navy */}
        <RoundedBox args={[2, 2, 2]} radius={0.15} smoothness={4}>
          <meshStandardMaterial 
            color="#0B1B3D" 
            roughness={0.25} 
            metalness={0.4} 
          />
        </RoundedBox>

        {/* Outer Accent Rim / Band - Brand Gold */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.55, 0.07, 16, 64]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            roughness={0.15} 
            metalness={0.9} 
          />
        </mesh>
      </group>
    </Float>
  );
}

export function ProductCanvas() {
  return (
    <div className="w-full h-80 sm:h-96 relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -5, -5]} intensity={1} color="#E8C766" />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.6} penumbra={1} />
        
        {/* 3D Model */}
        <InteractiveMesh />
        
        {/* Interactive Controls */}
        <OrbitControls 
          enableZoom={false} 
          autoRotate={false} 
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={Math.PI / 3} 
        />
      </Canvas>
    </div>
  );
}