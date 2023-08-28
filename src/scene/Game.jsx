/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { extend, useThree } from "@react-three/fiber";
import { Skybox } from "../prefabs/SkyBox";
import { useRef, useEffect } from "react";
// import { Physics } from "@react-three/rapier";
import { Physics } from "@react-three/cannon";
import { Ground } from "../components/Ground";
import { Player } from "../components/Player";
import { Plane } from "../components/Plane";
import { Cube } from "../components/Cube";
import Gun from "../components/Gun";
import Enemy from "../components/Enemy";
import { useState } from "react";

extend({ PointerLockControls });

export const Game = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

  const [enemies, setEnemies] = useState([]);
  const [enemyCount, setEnemyCount] = useState(0);

  useEffect(() => {
    camera.layers.enable(0);
    camera.layers.enable(1);
  }, [camera]);

  useEffect(() => {
    const handleFocus = () => {
      controls.current.lock();
    };
    document.addEventListener("click", handleFocus);

    return () => {
      document.removeEventListener("click", handleFocus);
    };
  }, [gl]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyCount((prevCount) => prevCount + 1);
      setEnemies((prevEnemies) => [
        ...prevEnemies,
        <Enemy
          key={enemyCount}
          position={[Math.random() * 20 - 10, 0, Math.random() * 20 - 10]}
        />,
      ]);
    }, 5000); // 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [enemyCount]);
  return (
    <>
      <Skybox />

      <pointerLockControls ref={controls} args={[camera, gl.domElement]} />

      <directionalLight position={[3, 0, 3]} intensity={0.5} castShadow />
      <pointLight position={[0, 0, -3]} intensity={0.6} castShadow />
      <pointLight position={[0, 0, 4]} intensity={0.6} castShadow />
      <ambientLight intensity={0.6} />

      <Physics
        gravity={[0, -9, 0]}
        tolerance={0}
        iterations={50}
        broadphase={"SAP"}
      >
        {/* <Ground /> */}
        <Plane />
        <Player />

        {/* <Cube position={[0, 0, -5]} layers={1} />
        <Cube position={[-0.6, 0, -5]} />
        <Cube position={[0.6, 0, -5]} />
        <Cube position={[-0.3, 0.5, -5]} />
        <Cube position={[0.3, 0.5, -5]} />
        <Cube position={[0, 1, -5]} /> */}
        <Cube position={[-5, 0, -5]} />
        <Cube position={[-5, 0.5, -5]} />
        <Cube position={[-5, 1, -5]} />
        <Cube position={[-5, 1.5, -5]} />

        <Enemy position={[-10, 0, -10]} />

        {enemies}
      </Physics>
    </>
  );
};
