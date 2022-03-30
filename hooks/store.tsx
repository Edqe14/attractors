import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Remote, wrap } from 'comlink';
import { AttractorType, CalculatorWorker, Store } from '@/types';

import attractors from '@/lib/constants/attractors';
import fetchStorage from '@/lib/fetchStorage';
import isStorageSupported from '@/lib/isStorageSupported';

const ctx = createContext<Partial<Store>>({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Provider = (props: Record<string, any>) => {
  const coordinate = useRef<Vector3>(new Vector3(0.01, 0, 0.01));

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
  const [multiColor, setMultiColor] = useState<Store['multiColor']>(false);

  // Get data from localStorage
  useEffect(() => {
    setAutoRotate(fetchStorage('autoRotate', '1') === '1');
    setAutoRotateSpeed(parseFloat(fetchStorage('autoRotateSpeed', '1')));
    setMaxPoints(parseInt(fetchStorage('maxPoints', '7500'), 10));
    setLineWidth(parseFloat(fetchStorage('lineWidth', '0.5')));
    setColor(fetchStorage('color', '#ffffff'));
  }, []);

  // Update localStorage
  useEffect(() => {
    if (isStorageSupported()) {
      window.localStorage.setItem('autoRotate', Number(autoRotate).toString());
      window.localStorage.setItem('autoRotateSpeed', autoRotateSpeed.toFixed(2));
      window.localStorage.setItem('maxPoints', maxPoints.toString());
      window.localStorage.setItem('lineWidth', lineWidth.toFixed(2));
      window.localStorage.setItem('color', color);
    }
  }, [autoRotate, autoRotateSpeed, color, lineWidth, maxPoints]);

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

  const worker = useRef<Worker>();
  const api = useRef<Remote<CalculatorWorker>>();

  // Calculate points
  // === POINTS ONLY
  useEffect(() => {
    if (activeAttractor && activeAttractor.type === AttractorType.Point) {
      showNotification({
        id: 'calculating-points',
        title: 'Calculating...',
        message: 'Please wait until all the points are calculated (this could take a while)',
        color: 'orange',
        loading: true,
        disallowClose: true,
        autoClose: false
      });

      worker.current = new Worker(new URL('../workers/calculator.worker', import.meta.url), {
        type: 'module'
      });

      api.current = wrap<CalculatorWorker>(worker.current);
      api.current.calculate(activeAttractor.id, maxPoints, multiplier).then((val) => {
        if (!val) {
          return updateNotification({
            id: 'calculating-points',
            title: 'Oops!',
            message: 'Points failed to calculate...',
            color: 'red',
            loading: false,
            disallowClose: false,
            autoClose: 3000
          });
        }

        updateNotification({
          id: 'calculating-points',
          title: 'Done!',
          message: 'Points calculated successfully',
          color: 'green',
          loading: false,
          disallowClose: false,
          autoClose: 3000
        });

        setPoints(val);
      });
    }

    return () => worker.current?.terminate();
  }, [activeAttractor, maxPoints]);

  // Check if points includes NaN (usually because too high multiplier) or broken constants
  // === CURVES ONLY
  useEffect(() => {
    if (activeAttractor?.type === AttractorType.Curve && points.some((v) => v.toArray().some(Number.isNaN))) {
      setPoints([]);
      coordinate.current = new Vector3(0.01, 0, 0);

      showNotification({
        id: 'nan-in-points',
        title: 'Whoosh...',
        message: 'We went light speed! THis might be caused by too high multiplier (try lowering it down below 0.02) or broken constants',
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
    setScale,
    multiColor,
    setMultiColor
  };

  return <ctx.Provider {...props} value={data} />;
};

export const useStore = () => useContext(ctx) as Store;