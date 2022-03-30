import { Vector3 } from 'three';
import { Attractor, AttractorType } from '@/types';
import simpleConstants from './simplifyConstants';

type ReturnType = {
  // [AttractorType.Curve]: { dX: number; dY: number; dZ: number };
  [K in AttractorType]: Record<string, number>;
};

interface Data {
  multiplier: number;
  array?: [number, number][];
}

const runCalculator = <T extends Attractor>(attractor: T, args: Vector3 | number, { multiplier, array }: Data): ReturnType[T['type']] => {
  const simplified = simpleConstants(attractor.constants);

  switch (attractor.type) {
    case (AttractorType.Curve): {
      const dX = attractor.calculator.dX(args as Vector3, simplified, multiplier);
      const dY = attractor.calculator.dY(args as Vector3, simplified, multiplier);
      const dZ = attractor.calculator.dZ(args as Vector3, simplified, multiplier);

      return { dX, dY, dZ };
    }

    case (AttractorType.Point): {
      const x = attractor.calculator.x(args as number, simplified, multiplier, array as [number, number][]);
      const y = attractor.calculator.y(args as number, simplified, multiplier, array as [number, number][]);

      return { x, y };
    }

    default: return {};
  }
};

export default runCalculator;