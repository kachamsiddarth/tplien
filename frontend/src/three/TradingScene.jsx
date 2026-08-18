import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment } from '@react-three/drei';

function useRupeeTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Radial gold gradient — bright center, dark edge (like a real coin)
    const grad = ctx.createRadialGradient(
      size * 0.38, size * 0.32, 20,
      size / 2,    size / 2,   size / 2
    );
    grad.addColorStop(0,    '#FFFBD6');
    grad.addColorStop(0.2,  '#FFE55C');
    grad.addColorStop(0.55, '#D4940F');
    grad.addColorStop(0.82, '#B07A00');
    grad.addColorStop(1,    '#7A5200');

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Outer raised rim groove
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 22, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(60, 35, 0, 0.45)';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 32, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 235, 120, 0.3)';
    ctx.lineWidth = 5;
    ctx.stroke();

    // ₹ — dark shadow for depth
    ctx.font = 'bold 265px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(50, 28, 0, 0.55)';
    ctx.fillText('₹', size / 2 + 7, size / 2 + 9);

    // ₹ — main body
    ctx.fillStyle = '#5C3800';
    ctx.fillText('₹', size / 2, size / 2);

    // ₹ — highlight streak
    ctx.fillStyle = 'rgba(255, 245, 160, 0.18)';
    ctx.fillText('₹', size / 2 - 4, size / 2 - 4);

    return new THREE.CanvasTexture(canvas);
  }, []);
}

const RupeeCoin = () => {
  const coinRef = useRef();
  const rupeeTexture = useRupeeTexture();

  useFrame(({ clock }) => {
    if (coinRef.current) {
      coinRef.current.rotation.y = clock.getElapsedTime() * 0.55;
    }
  });

  const edgeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C8960A',
    roughness: 0.06,
    metalness: 0.98,
  }), []);

  const faceMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: rupeeTexture,
    roughness: 0.06,
    metalness: 0.4,
  }), [rupeeTexture]);

  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={1.5}>
      {/*
        Initial tilt: lean the coin ~70° toward camera so the face is
        mostly visible. Y animation then gives the flip/spin.
      */}
      <group ref={coinRef} rotation={[1.25, 0, 0]}>

        {/* Coin edge (cylinder side only — open caps) */}
        <mesh material={edgeMat}>
          <cylinderGeometry args={[1.55, 1.55, 0.28, 128, 1, true]} />
        </mesh>

        {/* Front cap */}
        <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]} material={faceMat}>
          <circleGeometry args={[1.55, 128]} />
        </mesh>

        {/* Back cap */}
        <mesh position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]} material={faceMat}>
          <circleGeometry args={[1.55, 128]} />
        </mesh>

      </group>
    </Float>
  );
};

const TradingScene = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '420px' }}>
      <Canvas camera={{ position: [0, 0.5, 5.5], fov: 42 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]}  intensity={3}   color="#FFFFFF" />
        <directionalLight position={[-3, 2, 3]}  intensity={1.2} color="#FFE88A" />
        <pointLight       position={[0, 5, 4]}   intensity={2}   color="#FFFFFF" />
        <spotLight
          position={[0, 8, 6]}
          angle={0.4}
          penumbra={0.6}
          intensity={4}
          color="#FFFFFF"
          castShadow
        />
        <Environment preset="sunset" />
        <RupeeCoin />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default TradingScene;
