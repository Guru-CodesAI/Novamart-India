"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sphere, MeshDistortMaterial, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

function ProductOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[1.5, 128, 128]}>
        <MeshDistortMaterial
          color="#7C3AED"
          attach="material"
          distort={0.2}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Ring */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.2, 0.03, 16, 100]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={0.6} />
      </mesh>

      <mesh rotation={[-Math.PI / 6, Math.PI / 4, 0]}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshBasicMaterial color="#FF00FF" transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

export function Product3DViewer() {
  return (
    <div className="w-full h-full bg-transparent rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#7C3AED" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#00F5FF" />
        <pointLight position={[0, 5, -5]} intensity={0.6} color="#FF00FF" />

        <ProductOrb />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={2}
        />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-white/40">
        🖱️ Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
