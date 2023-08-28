// /* eslint-disable no-undef */
// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react/no-unknown-property */
// import { useEffect, useState, useMemo } from "react";
// import { useBox, useSphere } from "@react-three/cannon";
// import niceColors from "nice-color-palettes";
// const paletteIndex = 8;
// const Enemy = (props) => {
//   const [sphereRef, api] = useSphere(() => ({
//     mass: 1,
//     args: [1],
//     material: {
//       friction: 1,
//       restitution: 0,
//     },
//     ...props,
//   }));

//   const [targetPosition] = useState([0, 0, 0]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       api.position.subscribe((currentPosition) => {
//         const [x, y, z] = currentPosition;
//         const [tx, ty, tz] = targetPosition;

//         const step = 0.03;

//         const newX = x > tx ? x - step : x + step;
//         const newY = y > ty ? y - step : y + step;
//         const newZ = z > tz ? z - step : z + step;

//         api.position.set(newX, newY, newZ);
//       });
//     }, 100);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [api, targetPosition]);

//   const color = useMemo(
//     () =>
//       niceColors[paletteIndex][
//         Math.floor(Math.random() * niceColors[paletteIndex].length)
//       ],
//     []
//   );

//   return (
//     <mesh ref={sphereRef} castShadow layers={props.layers}>
//       <sphereBufferGeometry args={[0.5]} />
//       <meshLambertMaterial color={color} />
//     </mesh>
//   );
// };

// export default Enemy;
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { useEffect, useState, useMemo } from "react";
import { useBox, useSphere } from "@react-three/cannon";
import niceColors from "nice-color-palettes";
import { Katarina } from "../models/Katarina";
const paletteIndex = 8;
const Enemy = (props) => {
  const [sphereRef, api] = useBox(() => ({
    mass: 1,
    args: [0.5, 1, 0.5],
    material: {
      friction: 1,
      restitution: 0,
    },
    ...props,
  }));

  const [targetPosition] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      api.position.subscribe((currentPosition) => {
        const [x, y, z] = currentPosition;
        const [tx, ty, tz] = targetPosition;

        // Calculate the distance to the target position
        const distance = Math.sqrt(
          (x - tx) ** 2 + (y - ty) ** 2 + (z - tz) ** 2
        );

        // Check if the object is close enough to stop
        if (distance < 0.05) {
          clearInterval(interval);
          return;
        }

        const step = 0.03;
        const newX = x > tx ? x - step : x + step;
        const newY = y > ty ? y - step : y + step;
        const newZ = z > tz ? z - step : z + step;

        api.position.set(newX, newY, newZ);
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [api, targetPosition]);

  const color = useMemo(
    () =>
      niceColors[paletteIndex][
        Math.floor(Math.random() * niceColors[paletteIndex].length)
      ],
    []
  );

  return (
    <mesh ref={sphereRef} castShadow layers={props.layers}>
      {/* <boxBufferGeometry args={[0.5, 1, 0.5]} /> */}
      {/* <meshLambertMaterial color={color} /> */}
      <Katarina scale={0.02} />
    </mesh>
  );
};

export default Enemy;
