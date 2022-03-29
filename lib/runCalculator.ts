import { Vector3 } from 'three';
import { Attractor } from '@/types';
import simpleConstants from './simplifyConstants';

const runCalculator = (attractor: Attractor, position: Vector3, multiplier: number) => {
  const simplified = simpleConstants(attractor.constants);

  const dX = attractor.calculator.dX(position, simplified, multiplier);
  const dY = attractor.calculator.dY(position, simplified, multiplier);
  const dZ = attractor.calculator.dZ(position, simplified, multiplier);

  return { dX, dY, dZ };
};

export default runCalculator;