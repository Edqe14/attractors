import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useRef } from 'react';
import { Store } from '@/types';
import runCalculator from '@/lib/runCalculator';

interface IProps {
  data: Store;
}

const Pen = ({ data }: IProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const line = useRef<any>();

  useFrame(() => {
    if (!data.activeAttractor) return;

    const { dX, dY, dZ } = runCalculator(data.activeAttractor, data.coordinate.current, data.multiplier);

    data.coordinate.current.add(new Vector3(dX, dY, dZ));

    const points = [...data.points, data.coordinate.current.clone()];
    if (points.length > data.maxPoints) points.shift();

    data.setPoints(points);
  });

  if (data.points.length <= 0) return null;

  return <Line
    ref={line}
    points={data.points}
    color={data.color}
    lineWidth={data.lineWidth}
    position={[0, 0, 0]}
    scale={data.scale}
    rotation={data.activeAttractor?.options?.rotation}
    alphaWrite
  />;
};

export default Pen;