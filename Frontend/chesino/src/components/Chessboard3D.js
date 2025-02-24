import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls} from '@react-three/drei';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';


function ChessboardModel() {
  const { scene } = useGLTF('/chinese_chess.glb');
  const ref = useRef();

  useFrame(() => {
    // Optional: Add any animations or interactions here
    ref.current.rotation.y -= 0.001;
  });

  return <primitive object={scene} ref={ref} scale={3} />;
}

const Chessboard3D = () => {
  return (
    <Canvas
      camera={{
        position: [-50, 7, 0], // Adjust this to position the camera appropriately
        rotation: [-Math.PI / 0, 40, 0], // Adjust this to set the camera angle
        fov: 90,
        aspect: 1.77// Adjust this to control the field of view
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
      <OrbitControls enableZoom={false}/>
    </Canvas>
  );
};

export default Chessboard3D;
