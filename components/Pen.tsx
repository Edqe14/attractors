import { Instance, Instances, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useRef } from 'react';
import { AttractorType, Store } from '@/types';
import runCalculator from '@/lib/runCalculator';

interface IProps {
  data: Store;
}


const Pen = ({ data }: IProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const line = useRef<any>();

  useFrame((_, delta) => {
    if (!data.activeAttractor || data.activeAttractor.type !== AttractorType.Curve) return;

    const { dX, dY, dZ } = runCalculator(data.activeAttractor, data.coordinate.current, {
      multiplier: data.multiplier
    });

    data.coordinate.current.add(new Vector3(dX, dY, dZ));

    const points = [...data.points, data.coordinate.current.clone()];
    if (points.length > data.maxPoints) points.shift();

    data.setPoints(points);
    data.activeAttractor.constants.forEach((c) => c.onFrame?.(delta));
  });

  if (data.points.length <= 0) return null;

  switch (data.activeAttractor?.type) {
    case (AttractorType.Curve): {
      return <Line
        ref={line}
        points={data.points}
        color={data.color}
        lineWidth={data.lineWidth}
        position={[0, 0, 0]}
        scale={data.scale}
        rotation={data.activeAttractor?.options?.rotation}
        alphaWrite
        // vertexColors={!data.multiColor ? undefined : data.points.map((_, i) => new Array(3).fill(Math.floor(((i + clock.elapsedTime * 60) % 360))))}
      />;
    }

    case (AttractorType.Point): {
      return (
        <Instances limit={data.maxPoints}>
          <boxGeometry args={[5,5,5]} />
          <meshStandardMaterial />

          {data.points.map((pos, i) => <Instance key={i} position={pos} color={data.color} scale={data.scale} />)}
        </Instances>
      );
    }

    default: return null;
  }
};

export default Pen;