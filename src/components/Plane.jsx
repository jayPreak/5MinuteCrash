/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import * as THREE from "three";
import React from "react";
import { usePlane } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";

export const Plane = () => {
  const texture = useTexture("./buildspace4.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  /** Plane collider */
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.25, 0],
    material: {
      friction: 0.1,
    },
  }));

  return (
    // <mesh ref={ref} receiveShadow={true} scale={[1000, 1000, 1000]}>
    //   <planeGeometry args={[1000, 1000]} />
    //   <meshLambertMaterial
    //     // map={texture}
    //     // map-repeat={[240, 240]}
    //     color={"red"}
    //     receiveShadow
    //   />
    // </mesh>
    <mesh ref={ref} receiveShadow={true} scale={[1000, 1000, 1000]}>
      <planeBufferGeometry />
      <meshBasicMaterial
        color="#a90000"
        map={texture}
        map-repeat={[240, 240]}
        receiveShadow
      />
    </mesh>
  );
};
