import { Euler, Vector3 } from 'three';
import { Dispatch, SetStateAction, MutableRefObject } from 'react';

export interface Constant {
  id: string;
  name: string;
  value: number;
  factoryValue: () => number;
  onFrame?: (delta: number) => void;
}

export type Dispatcher<T> = Dispatch<SetStateAction<T>>;
export type Constants = Constant[];
export type SimpleConstants = Record<string, number>;
export type CurveCalculatorFunction = (vector: Vector3, constants: SimpleConstants, multiplier: number) => number;
export type PointCalculatorFunction = (i: number, constants: SimpleConstants, multiplier: number, array: [number, number][]) => number;

export interface CurveAttractorCalculator {
  dX: CurveCalculatorFunction;
  dY: CurveCalculatorFunction;
  dZ: CurveCalculatorFunction;
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: Function;
}

export interface PointAttractorCalculator {
  x: PointCalculatorFunction;
  y: PointCalculatorFunction;
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: Function;
}

export interface AttractorOptions {
  scale?: number;
  rotation?: Euler;
  multiplier?: number;
}

export enum AttractorType {
  'Curve' = 0,
  'Point' = 1,
}

export interface AttractorStruct {
  id: string;
  name: string;
  group?: string;
  article?: string;
  constants: Constants;
  options?: AttractorOptions;
}

export type Attractor = AttractorStruct & (
  {
    type: AttractorType.Curve;
    calculator: CurveAttractorCalculator;
  } | {
    type: AttractorType.Point;
    calculator: PointAttractorCalculator;
  }
);

export type CurveAttractor = AttractorStruct & {
  type: AttractorType.Curve;
  calculator: CurveAttractorCalculator;
};

export type PointAttractor = AttractorStruct & {
  type: AttractorType.Point;
  calculator: PointAttractorCalculator;
};

export interface Store {
  coordinate: MutableRefObject<Vector3>;
  attractors: Attractor[];

  index: number;
  setIndex: Dispatcher<this['index']>;

  activeAttractor: Attractor | null;
  setActiveAttractor: Dispatcher<this['activeAttractor']>;

  multiplier: number;
  setMultiplier: Dispatcher<this['multiplier']>;

  points: Vector3[];
  setPoints: Dispatcher<this['points']>;

  maxPoints: number;
  setMaxPoints: Dispatcher<this['maxPoints']>;

  autoRotate: boolean;
  setAutoRotate: Dispatcher<this['autoRotate']>;

  autoRotateSpeed: number;
  setAutoRotateSpeed: Dispatcher<this['autoRotateSpeed']>;

  color: string;
  setColor: Dispatcher<this['color']>;

  lineWidth: number;
  setLineWidth: Dispatcher<this['lineWidth']>;

  scale: number;
  setScale: Dispatcher<this['scale']>;

  multiColor: boolean;
  setMultiColor: Dispatcher<this['multiColor']>;
}

export interface CalculatorWorker {
  calculate(id: string, max: number, multiplier: number): Vector3[] | null;
}