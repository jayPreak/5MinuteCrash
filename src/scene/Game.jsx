import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { extend, useThree } from "@react-three/fiber";
import { Skybox } from "../prefabs/SkyBox";
import { useRef, useEffect } from "react";
import { Physics } from "@react-three/rapier";
// import { Physics } from "@react-three/cannon";
import { Ground } from "../components/Ground";
import { Player } from "../components/Player";
import { Plane } from "../components/Plane";

extend({ PointerLockControls });

export const Game = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

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
        <Ground />
        {/* <Plane /> */}
        <Player />
      </Physics>
    </>
  );
};
