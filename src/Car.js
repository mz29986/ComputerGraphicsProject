import React, { useEffect, useMemo } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh, Raycaster, Vector2 } from "three";

export function Car() {
  const { camera, gl } = useThree();
  const gltf = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "models/car/scene.gltf"
  );

  const { raycaster, mouse } = useMemo(() => ({
    raycaster: new Raycaster(),
    mouse: new Vector2()
  }), []);

  useEffect(() => {
    gltf.scene.scale.set(0.005, 0.005, 0.005);
    gltf.scene.position.set(0, -0.035, 0);
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 3;
        object.material.needsUpdate = true;
      }
    });
  }, [gltf]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(gltf.scene, true);

      const infoBox = document.getElementById("infoBox");
      if (!infoBox) return;

      if (intersects.length > 0) {
        infoBox.innerHTML = `
          <div class="info-title">Corvette</div>
          <div class="info-year">2025 Edition</div>
          <div class="info-details">
            Petrol Vehicle<br>
            Range: 405 km
          </div>
        `;
        infoBox.style.display = "block";
        infoBox.style.left = event.clientX + 10 + "px";
        infoBox.style.top = event.clientY + 10 + "px";
      } else {
        infoBox.style.display = "none";
      }
    };

    gl.domElement.addEventListener("mousemove", handleMouseMove);

    return () => {
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera, gl, gltf.scene, mouse, raycaster]);

  useFrame((state, delta) => {
    let t = state.clock.getElapsedTime();
    let group = gltf.scene.children[0].children[0].children[0];
    group.children[0].rotation.x = t * 2;
    group.children[2].rotation.x = t * 2;
    group.children[4].rotation.x = t * 2;
    group.children[6].rotation.x = t * 2;
  });

  return <primitive object={gltf.scene} />;
}