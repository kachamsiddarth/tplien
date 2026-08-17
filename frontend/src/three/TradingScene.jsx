import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Float, OrbitControls } from '@react-three/drei';

const RotatingCube = () => {
  const cubeRef = useRef();

  useFrame(({ clock }) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y = clock.getElapsedTime() * 0.4;
      cubeRef.current.rotation.x = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
      <Box ref={cubeRef} args={[2.2, 2.2, 2.2]}>
        <meshStandardMaterial
          color="#FFE14A"
          roughness={0.1}
          metalness={0.1}
        />
      </Box>
    </Float>
  );
};

const TradingScene = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '420px' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 10, 7]} intensity={1.5} color="#FFFFFF" />
        <RotatingCube />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
};

export default TradingScene;
