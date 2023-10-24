import { atom } from "recoil";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let defaultEnemyPositions = []



// function addEnemyPosition() {
//   defaultEnemyPositions = [...defaultEnemyPositions, { x: getRandomInt(-80, 80), y: getRandomInt(0, 50), z: getRandomInt(-80, -150) }];
//   console.log(defaultEnemyPositions)
//   setTimeout(addEnemyPosition, 3000)
// }
// addEnemyPosition()

export const shipPositionState = atom({
  key: "shipPosition", // unique ID (with respect to other atoms/selectors)
  default: { position: {}, rotation: {} } // default value (aka initial value)
});

//x -80 80
//y 0 50
//z 

export const enemyPositionState = atom({
  key: "enemyPosition", // unique ID (with respect to other atoms/selectors)
  default: defaultEnemyPositions // default value (aka initial value)
});

export const laserPositionState = atom({
  key: "laserPositions", // unique ID (with respect to other atoms/selectors)
  default: [] // default value (aka initial value)
});

export const scoreState = atom({
  key: "score", // unique ID (with respect to other atoms/selectors)
  default: 0 // default value (aka initial value)
});
