/* eslint-disable no-restricted-globals */

import * as Comlink from 'comlink';
import { Vector3 } from 'three';
import { CalculatorWorker, PointAttractor } from '@/types';
import simpleConstants from '@/lib/simplifyConstants';

import attractors from '@/lib/constants/attractors';

Comlink.expose({
  calculate(id, max, multiplier) {
    const attractor = attractors.find((a) => a.id === id) as PointAttractor | undefined;
    if (!attractor) return null;

    const array = new Array(max).fill(0);
    const simplified = simpleConstants(attractor.constants);

    for(let i = 0; i < array.length; i += 1) {
      const x = attractor.calculator.x(i, simplified, multiplier, array);
      const y = attractor.calculator.y(i, simplified, multiplier, array);

      // eslint-disable-next-line no-param-reassign
      array[i] = [x, y];
    }

    return array.map(([x, y]) => new Vector3(x, y, 0));
  }
} as CalculatorWorker);

export {}; // Fix --isolatedModules