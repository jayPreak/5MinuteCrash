/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useSphere } from "@react-three/cannon";

const Bullet = (props) => {
  /** Bullet collider */
  const [sphereRef] = useSphere(() => ({
    mass: 5,
    args: [0.1],
    ...props,
  }));

  return (
    <mesh ref={sphereRef} castShadow>
      <sphereBufferGeometry args={[0.1, 32, 32]} />
      <meshLambertMaterial color="hotpink" />
    </mesh>
  );
};
export default Bullet;
