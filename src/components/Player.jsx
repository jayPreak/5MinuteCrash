/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
// import * as RAPIER from "@dimforge/rapier3d-compat";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
// import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
// import Gun from "./Gun";
import Senna from "../models/Senna";
import Bullet from "./Bullet";
import { useBox, useSphere } from "@react-three/cannon";
import { Vector3, Raycaster } from "three";

import { useVariable } from "../hooks/useVariable";
import { useMouseInput } from "../hooks/useMouseInput";
import { useKeyboardInput } from "../hooks/useKeyBoardInput";
import { lerp } from "three/src/math/MathUtils";

const speed = 300;
const bulletSpeed = 30;
const bulletCoolDown = 300;
const jumpSpeed = 5;
const jumpCoolDown = 400;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();

export function Player() {
  const [sphereRef, api] = useSphere(() => ({
    mass: 1,
    fixedRotation: true,
    position: [0, 1, 0],
    args: [0.2], // <--- Enclose your radius in an array
    material: {
      friction: 0,
    },
  }));
  //gun
  const gun = useRef();
  /** Bullets */
  const [bullets, setBullets] = useState([]);

  /** Input hooks */
  const pressed = useKeyboardInput(["w", "a", "s", "d", " "]);
  const pressedMouse = useMouseInput();

  /** Converts the input state to ref so they can be used inside useFrame */
  const input = useVariable(pressed);
  const mouseInput = useVariable(pressedMouse);

  /** Player movement constants */
  const { camera, scene } = useThree();

  /** Player state */
  const state = useRef({
    timeToShoot: 0,
    timeTojump: 0,
    vel: [0, 0, 0],
    jumping: false,
  });
  console.log(state);

  useEffect(() => {
    console.log(state);
    api.velocity.subscribe((v) => (state.current.vel = v));
  }, [api]);

  /** Player loop */
  useFrame((_, delta) => {
    /** Handles movement */
    const { w, s, a, d } = input.current;
    const space = input.current[" "];

    let velocity = new Vector3(0, 0, 0);
    let cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);

    let forward = new Vector3();
    forward.setFromMatrixColumn(camera.matrix, 0);
    forward.crossVectors(camera.up, forward);

    let right = new Vector3();
    right.setFromMatrixColumn(camera.matrix, 0);

    let [horizontal, vertical] = [0, 0];

    if (w) {
      vertical += 1;
    }
    if (s) {
      vertical -= 1;
    }
    if (d) {
      horizontal += 1;
    }
    if (a) {
      horizontal -= 1;
    }

    if (horizontal !== 0 && vertical !== 0) {
      velocity
        .add(forward.clone().multiplyScalar(speed * vertical))
        .add(right.clone().multiplyScalar(speed * horizontal));
      velocity.clampLength(-speed, speed);
    } else if (horizontal !== 0) {
      velocity.add(right.clone().multiplyScalar(speed * horizontal));
    } else if (vertical !== 0) {
      velocity.add(forward.clone().multiplyScalar(speed * vertical));
    }

    /** Updates player velocity */
    api.velocity.set(
      velocity.x * delta,
      state.current.vel[1],
      velocity.z * delta
    );
    // console.log(delta);
    /** Updates camera position */
    camera.position.set(
      sphereRef.current.position.x,
      sphereRef.current.position.y + 1,
      sphereRef.current.position.z
    );
    // console.log(camera.position);
    gun.current.children[0].rotation.x = lerp(
      gun.current.children[0].rotation.x,
      Math.sin((velocity.length() > 1) * delta * 10) / 6,
      0.1
    );

    gun.current.rotation.copy(camera.rotation);
    gun.current.position
      .copy(camera.position)
      .add(cameraDirection.clone().multiplyScalar(1));
    // gun.current.position.set(
    //   sphereRef.current.position.x,
    //   sphereRef.current.position.y,
    //   sphereRef.current.position.z
    // );
    // console.log(gun.current.position);

    /** Handles jumping */
    if (state.current.jumping && state.current.vel[1] < 0) {
      /** Ground check */
      const raycaster = new Raycaster(
        sphereRef.current.position,
        new Vector3(0, -1, 0),
        0,
        0.2
      );
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length !== 0) {
        state.current.jumping = false;
      }
    }

    if (space && !state.current.jumping) {
      const now = Date.now();
      if (now > state.current.timeTojump) {
        state.current.timeTojump = now + jumpCoolDown;
        state.current.jumping = true;
        api.velocity.set(state.current.vel[0], jumpSpeed, state.current.vel[2]);
      }
    }

    /** Handles shooting */
    const bulletDirection = cameraDirection.clone().multiplyScalar(bulletSpeed);
    const bulletPosition = camera.position
      .clone()
      .add(cameraDirection.clone().multiplyScalar(2));

    if (mouseInput.current.left) {
      const now = Date.now();
      if (now >= state.current.timeToShoot) {
        state.current.timeToShoot = now + bulletCoolDown;
        setBullets((bullets) => [
          ...bullets,
          {
            id: now,
            position: [bulletPosition.x, bulletPosition.y, bulletPosition.z],
            forward: [bulletDirection.x, bulletDirection.y, bulletDirection.z],
          },
        ]);
      }
    }
  });
  // useFrame((state) => {
  //   let cameraDirection = new Vector3();
  //   state.camera.getWorldDirection(cameraDirection);
  //   const { forward, backward, left, right, jump } = get();
  //   const velocity = ref.current.linvel();
  //   // update camera
  //   state.camera.position.set(...ref.current.translation());
  //   // update gun
  //   gun.current.children[0].rotation.x = lerp(
  //     gun.current.children[0].rotation.x,
  //     Math.sin((velocity.length() > 1) * state.clock.elapsedTime * 10) / 6,
  //     0.1
  //   );
  //   gun.current.rotation.copy(state.camera.rotation);
  //   gun.current.position
  //     .copy(state.camera.position)
  //     .add(state.camera.getWorldDirection(rotation).multiplyScalar(1));
  //   // movement
  //   frontVector.set(0, 0, backward - forward);
  //   sideVector.set(left - right, 0, 0);
  //   direction
  //     .subVectors(frontVector, sideVector)
  //     .normalize()
  //     .multiplyScalar(speed)
  //     .applyEuler(state.camera.rotation);
  //   ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
  // jumping
  // const world = rapier.world.raw();
  // const ray = world.castRay(
  //   new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 })
  // );
  // const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
  // if (jump && grounded) ref.current.setLinvel({ x: 0, y: 7.5, z: 0 });

  return (
    <>
      <group
        ref={gun}
        onPointerMissed={(e) => (gun.current.children[0].rotation.x = 0.4)}
        scale={0.05}
      >
        <Senna position={[8, -4, 8]} rotation={[0, 3.2, 0]} />
      </group>
      {/** Renders bullets */}
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            velocity={bullet.forward}
            position={bullet.position}
          />
        );
      })}
    </>
    // <>
    //   {/* <RigidBody
    //     ref={ref}
    //     colliders={false}
    //     mass={1}
    //     type="dynamic"
    //     position={[0, 10, 0]}
    //     enabledRotations={[false, false, false]}
    //   >
    //     <CapsuleCollider args={[0.75, 0.5]} />
    //   </RigidBody> */}
    //   {bullets.map((bullet) => {
    //     return (
    //       <Bullet
    //         key={bullet.id}
    //         velocity={bullet.forward}
    //         position={bullet.position}
    //       />
    //     );
    //   })}
    //   {/* <group
    //     ref={gun}
    //     // onPointerMissed={(e) => (gun.current.children[0].rotation.x = -0.8)}
    //   >
    //     <Gun position={[0.4, -0.2, 0.3]} />
    //   </group> */}
    // </>
  );
}
