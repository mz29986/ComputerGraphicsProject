import React, { useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { LinearEncoding, RepeatWrapping, TextureLoader } from "three";

export function Ground() {
  const [roadTexture, roughness, normal] = useLoader(TextureLoader, [
    process.env.PUBLIC_URL + "/materials/Road1.jpg",
    process.env.PUBLIC_URL + "/materials/terrain-roughness.jpg",
    process.env.PUBLIC_URL + "/materials/terrain-normal.jpg",
  ]);

  useEffect(() => {
    if (roadTexture && normal && roughness) {
      [roadTexture, normal, roughness].forEach((t) => {
        t.wrapS = RepeatWrapping;
        t.wrapT = RepeatWrapping;
        t.repeat.set(5, 5);
        t.offset.set(0, 0);
      });

      normal.encoding = LinearEncoding;
    }
  }, [roadTexture, normal, roughness]);

  useFrame((state, delta) => {
    if (!roadTexture || !normal || !roughness) return;

    let t = -state.clock.getElapsedTime() * 0.128;
    roadTexture.offset.set(0, t % 1);
    roughness.offset.set(0, t % 1);
    normal.offset.set(0, t % 1);
  });

  return (
    <mesh
      rotation-x={-Math.PI * 0.5}
      position={[0, -0.001, 0]}
      castShadow
      receiveShadow
    >
      <planeGeometry args={[70, 70]} />
      <MeshReflectorMaterial
        map={roadTexture}
        envMapIntensity={1}
        normalMap={normal}
        normalScale={[0.15, 0.15]}
        roughnessMap={roughness}
        dithering={true}
        color={[0.015, 0.015, 0.015]}
        roughness={0.7}
        blur={[1000, 400]}
        mixBlur={30}
        mixStrength={80}
        mixContrast={1}
        resolution={1024}
        mirror={0.75}
        depthScale={0.01}
        minDepthThreshold={0.9}
        maxDepthThreshold={1}
        depthToBlurRatioBias={0.25}
        debug={0}
        reflectorOffset={0.2}
      />
    </mesh>
  );
}
