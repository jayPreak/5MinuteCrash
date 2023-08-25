import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./components/Ground";
import { Player } from "./components/Player";
import { UI } from "./components/UI";
import { Crosshair } from "./components/Crosshair";
import { Skybox } from "./prefabs/SkyBox";
import { Game } from "./scene/Game";

function App() {
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <UI>
          <Crosshair />
        </UI>
        <Canvas shadows camera={{ fov: 45 }}>
          <Game />
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default App;

//
