"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function FloatingOrb({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const count = 3000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#7C3AED"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function MainOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.y * 0.3,
        0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.x * 0.5 + state.clock.elapsedTime * 0.1,
        0.05
      );
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[2.5, 128, 128]} position={[3, 0, 0]}>
        <MeshDistortMaterial
          color="#7C3AED"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.85}
          envMapIntensity={2}
        />
      </Sphere>
    </Float>
  );
}

function RingEffect() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      ringRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={ringRef} position={[3, 0, 0]}>
      <torusGeometry args={[3.5, 0.04, 16, 100]} />
      <meshBasicMaterial color="#00F5FF" transparent opacity={0.4} />
    </mesh>
  );
}

function RingEffect2() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = -state.clock.elapsedTime * 0.2;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <mesh ref={ringRef} position={[3, 0, 0]}>
      <torusGeometry args={[4.2, 0.02, 16, 100]} />
      <meshBasicMaterial color="#FF00FF" transparent opacity={0.3} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#7C3AED" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00F5FF" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#FF00FF" />

      <Stars
        radius={80}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <ParticleField />
      <MainOrb />
      <RingEffect />
      <RingEffect2 />

      <FloatingOrb position={[-4, 2, -2]} color="#00F5FF" scale={0.5} speed={0.8} />
      <FloatingOrb position={[-3, -2, -1]} color="#FF00FF" scale={0.3} speed={1.2} />
      <FloatingOrb position={[6, -1, -3]} color="#7C3AED" scale={0.4} speed={0.6} />
      <FloatingOrb position={[0, 3, -4]} color="#22C55E" scale={0.25} speed={1.5} />
    </Canvas>
  );
}
