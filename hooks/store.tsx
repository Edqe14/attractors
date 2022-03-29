import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { showNotification } from '@mantine/notifications';
import { Store } from '@/types';

import attractors from '@/lib/constants/attractors';

const ctx = createContext<Partial<Store>>({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Provider = (props: Record<string, any>) => {
  const coordinate = useRef<Vector3>(new Vector3(0.01, 0, 0));

  const [index, setIndex] = useState<Store['index']>(0);
  const [activeAttractor, setActiveAttractor] = useState<Store['activeAttractor']>({ ...attractors[index] });
  const [multiplier, setMultiplier] = useState<Store['multiplier']>(activeAttractor?.options?.multiplier ?? 0.008);
  const [points, setPoints] = useState<Store['points']>([coordinate.current.clone()]);
  const [color, setColor] = useState<Store['color']>('#ffffff');
  const [lineWidth, setLineWidth] = useState<Store['lineWidth']>(0.5);
  const [scale, setScale] = useState<Store['scale']>(activeAttractor?.options?.scale ?? 1);
  const [autoRotate, setAutoRotate] = useState<Store['autoRotate']>(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState<Store['autoRotateSpeed']>(1);
  const [maxPoints, setMaxPoints] = useState<Store['maxPoints']>(7500);

  // Apply new attractor per index
  useEffect(() => {
    const newAttractor = attractors[index];

    if (newAttractor) {
      setPoints([]);
      setActiveAttractor({ ...newAttractor });

      coordinate.current = new Vector3(0.01, 0, 0);
    }
  }, [index]);

  // Apply Options
  useEffect(() => {
    if (activeAttractor) {
      if (activeAttractor.options?.scale) setScale(activeAttractor.options.scale);
      if (activeAttractor.options?.multiplier) setMultiplier(activeAttractor.options.multiplier);
    }
  }, [activeAttractor]);

  // Check if points includes NaN (usually because too high multiplier)
  useEffect(() => {
    if (points.some((v) => v.toArray().some(Number.isNaN))) {
      setPoints([]);
      coordinate.current = new Vector3(0.01, 0, 0);

      showNotification({
        id: 'nan-in-points',
        title: 'Whoosh...',
        message: 'We went light speed! THis might be caused by too high multiplier, try lowering it down below 0.02',
        color: 'red'
      });
    }
  }, [points]);

  const data: Store = {
    coordinate,
    index,
    setIndex,
    activeAttractor,
    setActiveAttractor,
    multiplier,
    setMultiplier,
    attractors,
    points,
    setPoints,
    maxPoints,
    setMaxPoints,
    autoRotate,
    setAutoRotate,
    autoRotateSpeed,
    setAutoRotateSpeed,
    color,
    setColor,
    lineWidth,
    setLineWidth,
    scale,
    setScale
  };

  return <ctx.Provider {...props} value={data} />;
};

export const useStore = () => useContext(ctx) as Store;