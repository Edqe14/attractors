import { useRef, useEffect } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Store } from '@/types';

interface Props {
  data: Store;
}


const Camera = ({ data }: Props) => {
  const target = new Vector3(0, 0, 0);
  const position = new Vector3(0, 0, 125);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cam = useRef<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const control = useRef<any>();
  const { gl } = useThree();

  const reset = useRef(false);
  const autoRotating = useRef(data.autoRotate);

  useEffect(() => {
    const handler = () => {
      const controlTarget = control.current;

      if (controlTarget && !reset.current) {
        if (Math.floor(controlTarget.target.distanceTo(target)) <= 8) return;

        reset.current = true;
        autoRotating.current = data.autoRotate === true;

        data.setAutoRotate(false);
      }
    };

    gl.domElement.addEventListener('dblclick', handler);

    return () => gl.domElement.removeEventListener('dblclick', handler);
  }, [control, reset, data.autoRotate]);

  useFrame(() => {
    const controlTarget = control.current;

    if (reset.current) {
      controlTarget.target.lerp(target, 0.05);
      controlTarget.object.position.lerp(position, 0.05);
      controlTarget.object.zoom = 1;
      controlTarget.object.updateProjectionMatrix();

      if (Math.floor(controlTarget.target.distanceTo(target)) <= 8) {
        data.setAutoRotate(autoRotating.current);

        reset.current = false;
      }
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cam} fov={45} far={50000} aspect={1.2} position={position.toArray()} />
      <OrbitControls
        ref={control}
        camera={cam.current}
        enabled
        enableDamping
        target={target.toArray()}
        autoRotate={data.autoRotate}
        autoRotateSpeed={data.autoRotateSpeed}
      />
    </>
  );
};

export default Camera;