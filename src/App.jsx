import React, { Suspense, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from 'recoil'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextureLoader } from 'three'
import {
  shipPositionState,
  enemyPositionState,
  laserPositionState,
  scoreState
} from './gameState'
import './styles.css'
import { useTexture } from '@react-three/drei'

// Game settings.
const LASER_RANGE = 100
const LASER_Z_VELOCITY = 1
const ENEMY_SPEED = 0.1
const GROUND_HEIGHT = -50

function Loading () {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach='geometry' args={[1, 16, 16]} />
      <meshStandardMaterial
        attach='material'
        color='white'
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

// A Ground plane that moves relative to the player. The player stays at 0,0
function Terrain () {
  const terrain = useRef()
  const texture = useTexture('./dirt.jpg')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  const terrainSize = 5000
  const resetPoint = 1500
  const moveSpeed = 1

  useFrame(() => {
    terrain.current.position.z += moveSpeed
    if (terrain.current.position.z >= resetPoint) {
      terrain.current.position.z = 0
    }
  })
  // Returns a mesh at GROUND_HEIGHT below the player. Scaled to 5000, 5000 with 128 segments.
  // X Rotation is -Math.PI / 2 which is 90 degrees in radians.
  return (
    <mesh
      visible
      position={[0, GROUND_HEIGHT, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      ref={terrain}
    >
      <planeBufferGeometry
        attach='geometry'
        args={[terrainSize, terrainSize, 128, 128]}
      />
      <meshBasicMaterial
        attach='material'
        color='red'
        roughness={1}
        metalness={0}
        wireframe
        // map={texture}
        // map-repeat={[240, 240]}
      />
    </mesh>
  )
}

// The players ship model. On each frame, check the cursor position and move the ship to point in the
// correct direction. Save ship position in state in order to drive other components like target reticle, and
// laser velocity.

function ArWing () {
  const [shipPosition, setShipPosition] = useRecoilState(shipPositionState)
  const ship = useRef()
  useFrame(({ mouse }) => {
    setShipPosition({
      position: { x: mouse.x * 6, y: mouse.y * 2 },
      rotation: { z: -mouse.x * 0.5, x: -mouse.x * 0.5, y: -mouse.y * 0.2 }
    })
  })
  // Update the ships position from the updated state.
  useFrame(() => {
    ship.current.rotation.z = shipPosition.rotation.z
    ship.current.rotation.y = shipPosition.rotation.x
    ship.current.rotation.x = shipPosition.rotation.y
    ship.current.position.y = shipPosition.position.y
    ship.current.position.x = shipPosition.position.x
  })

  const { nodes } = useLoader(GLTFLoader, 'models/arwing.glb')
  return (
    <group ref={ship}>
      <mesh visible geometry={nodes.Default.geometry}>
        <meshStandardMaterial
          attach='material'
          color='#f0b2bc'
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  )
}

// Draws two sprites in front of the ship indicating the direction of fire.
// Uses a TextureLoader to load transparent PNG, and sprite to render on a 2d plane facing the camera.
function Target () {
  const rearTarget = useRef()
  const frontTarget = useRef()

  const loader = new TextureLoader()
  // A png with transparency to use as the target sprite.
  const texture = loader.load('target.png')

  // Update the position of the reticle based on the ships current position.
  useFrame(({ mouse }) => {
    rearTarget.current.position.y = -mouse.y * 10
    rearTarget.current.position.x = -mouse.x * 30

    frontTarget.current.position.y = -mouse.y * 20
    frontTarget.current.position.x = -mouse.x * 60
  })
  // Sprite material has a prop called map to set the texture on.
  return (
    <group>
      <sprite position={[0, 0, -8]} ref={rearTarget}>
        <spriteMaterial attach='material' map={texture} />
      </sprite>
      <sprite position={[0, 0, -16]} ref={frontTarget}>
        <spriteMaterial attach='material' map={texture} />
      </sprite>
    </group>
  )
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function Enemies () {
  const enemies = useRecoilValue(enemyPositionState)
  const setEnemyPositions = useSetRecoilState(enemyPositionState)

  useEffect(() => {
    const updateEnemies = () => {
      const newEnemy = {
        x: getRandomInt(-70, 70),
        y: getRandomInt(0, 30),
        z: getRandomInt(-80, -150)
      }
      setEnemyPositions(prevEnemies => [...prevEnemies, newEnemy])
    }
    const intervalID = setInterval(updateEnemies, 1500)

    return () => clearInterval(intervalID)
  }, [])
  return (
    <group>
      {enemies.map(enemy => (
        <mesh position={[enemy.x, enemy.y, enemy.z]} key={`${enemy.x}`}>
          <sphereBufferGeometry attach='geometry' args={[2, 8, 8]} />
          <meshStandardMaterial attach='material' color='white' wireframe />
        </mesh>
      ))}
    </group>
  )
}

// An invisible clickable element in the front of the scene.
// Manages creating lasers with the correct initial velocity on click.
function LaserController () {
  const shipPosition = useRecoilValue(shipPositionState)
  const [lasers, setLasers] = useRecoilState(laserPositionState)
  return (
    <mesh
      position={[0, 0, -8]}
      onClick={() =>
        setLasers([
          ...lasers,
          {
            id: Math.random(), // This needs to be unique.. Random isn't perfect but it works. Could use a uuid here.
            x: 0,
            y: 0,
            z: 0,
            velocity: [shipPosition.rotation.x * 6, shipPosition.rotation.y * 5]
          }
        ])
      }
    >
      <planeBufferGeometry attach='geometry' args={[100, 100]} />
      <meshStandardMaterial
        attach='material'
        color='orange'
        emissive='#ff0860'
        visible={false}
      />
    </mesh>
  )
}

// Draws all of the lasers existing in state.
function Lasers () {
  const lasers = useRecoilValue(laserPositionState)
  return (
    <group>
      {lasers.map(laser => (
        <mesh position={[laser.x, laser.y, laser.z]} key={`${laser.id}`}>
          <sphereBufferGeometry attach='geometry' args={[0.5, 32, 16]} />
          <meshStandardMaterial attach='material' emissive='red' />
        </mesh>
      ))}
    </group>
  )
}

// Calculate the distance between two points in 3d space.
// Used to detect lasers intersecting with enemies.
function distance (p1, p2) {
  const a = p2.x - p1.x
  const b = p2.y - p1.y
  const c = p2.z - p1.z

  return Math.sqrt(a * a + b * b + c * c)
}
// This component runs game logic on each frame draw to update game state.
function GameTimer ({ setGameScore }) {
  const [enemies, setEnemies] = useRecoilState(enemyPositionState)
  const [lasers, setLaserPositions] = useRecoilState(laserPositionState)
  const [score, setScore] = useRecoilState(scoreState)

  useFrame(({ mouse }) => {
    // Calculate hits and remove lasers and enemies, increase score.

    const hitEnemies = enemies
      ? enemies.map(
          enemy =>
            lasers.filter(
              () =>
                lasers.filter(laser => distance(laser, enemy) < 3).length > 0
            ).length > 0
        )
      : []

    if (hitEnemies.includes(true) && enemies.length > 0) {
      setScore(score + 1)
      setGameScore(score + 1)
      console.log('hit detected', score)
    }

    // Move all of the enemies. Remove enemies that have been destroyed, or passed the player.
    setEnemies(
      enemies
        .map(enemy => ({ x: enemy.x, y: enemy.y, z: enemy.z + ENEMY_SPEED }))
        .filter((enemy, idx) => !hitEnemies[idx] && enemy.z < 0)
    )
    // Move the Lasers and remove lasers at end of range or that have hit the ground.
    setLaserPositions(
      lasers
        .map(laser => ({
          id: laser.id,
          x: laser.x + laser.velocity[0],
          y: laser.y + laser.velocity[1],
          z: laser.z - LASER_Z_VELOCITY,
          velocity: laser.velocity
        }))
        .filter(laser => laser.z > -LASER_RANGE && laser.y > GROUND_HEIGHT)
    )
  })
  return null
}
export default function App () {
  const [gameScore, setGameScore] = useState(0)
  return (
    <>
      <Canvas style={{ background: 'black' }}>
        <RecoilRoot>
          <directionalLight intensity={1} />
          <ambientLight intensity={0.1} />
          <Terrain />
          <Suspense fallback={<Loading />}>
            <ArWing />
          </Suspense>
          <Target />
          <Enemies />
          <Lasers />
          <LaserController />
          <GameTimer setGameScore={setGameScore} />
        </RecoilRoot>
      </Canvas>

      <a className='score' target='_blank' rel='noopener noreferrer'>
        Score {gameScore}
      </a>
    </>
  )
}
