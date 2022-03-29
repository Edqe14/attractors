import { Euler, Vector3 } from 'three';
import { Dispatch, SetStateAction, MutableRefObject } from 'react';

export interface Constant {
  id: string;
  name: string;
  value: number;
  factoryValue: () => number;
}

export type Dispatcher<T> = Dispatch<SetStateAction<T>>;
export type Constants = Constant[];
export type SimpleConstants = Record<string, number>;
export type CalculatorFunction = (vector: Vector3, constants: SimpleConstants, multiplier: number) => number;

export interface AttractorCalculator {
  dX: CalculatorFunction;
  dY: CalculatorFunction;
  dZ: CalculatorFunction;
  [key: string]: CalculatorFunction;
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

export interface Attractor {
  id: string;
  name: string;
  type: AttractorType;
  group?: string;
  article?: string;
  constants: Constants;
  calculator: AttractorCalculator;
  options?: AttractorOptions;
}

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
}
