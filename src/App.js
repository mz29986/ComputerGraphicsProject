import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  CubeCamera,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  AccumulativeShadows,
  RandomizedLight,
  BakeShadows,
} from "@react-three/drei";
import "./style.css";
import { Car } from "./Car";
import { Ground } from "./Ground";

function CarShow() {
  return (
    <>
      <OrbitControls
        target={[0, 0.35, 0]}
        maxPolarAngle={1.4}
        minPolarAngle={0.5}
        maxDistance={10}
        minDistance={2.5}
        enablePan={false}
      />
      <PerspectiveCamera makeDefault fov={45} position={[3, 2, 5]} />
      <Environment
        files={process.env.PUBLIC_URL + "/environment/mountain.hdr"}
        background
        blur={0.5}
        ground={{
          height: 15,
          radius: 130,
          scale: 100,
        }}
      />
      <directionalLight
        color={[1, 0.95, 0.8]}
        intensity={3.5}
        position={[5, 12, 5]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <AccumulativeShadows
        temporal
        frames={100}
        color="#316d39"
        colorBlend={0.5}
        opacity={0.8}
        scale={10}
      >
        <RandomizedLight
          amount={8}
          radius={4}
          position={[5, 5, 2]}
          bias={0.001}
        />
      </AccumulativeShadows>
      <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <Car />
          </>
        )}
      </CubeCamera>
      <Ground />
      <ambientLight intensity={1.5} />
      <BakeShadows />
    </>
  );
}

export function App() {
  return (
    <>
      <div id="infoBox" className="info-box"></div>
      <Suspense fallback={null}>
        <Canvas shadows>
          <CarShow />
        </Canvas>
      </Suspense>
    </>
  );
}