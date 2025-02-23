import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls} from '@react-three/drei';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';


function ChessboardModel() {
  const { scene } = useGLTF('/chess_board.glb');
  const ref = useRef();

  useFrame(() => {
    // Optional: Add any animations or interactions here
  });

  return <primitive object={scene} ref={ref} scale={3} />;
}

const Chessboard3D = () => {
  return (
    <Canvas
      camera={{
        position: [0, 10, 10], // Adjust this to position the camera appropriately
        rotation: [-Math.PI / 2, 0, 0], // Adjust this to set the camera angle
        fov: 75, // Adjust this to control the field of view
      }}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Chessboard Model */}
      <ChessboardModel />

      {/* Depth of Field Effect */}
      <EffectComposer>
        <DepthOfField
          target={[0, 0, 0]} // Adjust this to set the focal point
          focalLength={0.02} // Adjust this to control the focal length
          bokehScale={2} // Adjust this to control the bokeh effect
          height={480}
        />
      </EffectComposer>

      {/* OrbitControls for interactive camera */}
      <OrbitControls />
    </Canvas>
  );
};

export default Chessboard3D;
