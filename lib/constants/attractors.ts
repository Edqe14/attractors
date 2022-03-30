import { Euler } from 'three';
import { Attractor, AttractorType } from '@/types';
import random from '../random';

const attractors = [
  // Continuous maps
  {
    id: 'lorenz',
    name: 'Lorenz Attractor',
    group: 'Curves',
    type: AttractorType.Curve,
    options: {
      scale: 1,
      multiplier: 0.008
    },
    constants: [
      {
        id: 'alpha',
        name: String.raw`$\alpha$`,
        value: 10,
        factoryValue: () => 10
      },
      {
        id: 'beta',
        name: String.raw`$\beta$`,
        value: 28,
        factoryValue: () => 28
      },
      {
        id: 'sigma',
        name: String.raw`$\sigma$`,
        value: 8 / 3,
        factoryValue: () => 8 / 3
      },
    ],
    calculator: {
      // http://www.3d-meier.de/tut5/Seite2.html
      dX: (vec, consts, multiplier) => (consts.alpha * (vec.y - vec.x)) * multiplier,
      dY: (vec, consts, multiplier) => (vec.x * (consts.beta - vec.z) - vec.y) * multiplier,
      dZ: (vec, consts, multiplier) => ((vec.x * vec.y) - (consts.sigma * vec.z)) * multiplier,
    }
  },
  {
    id: 'rossler',
    name: 'Rössler Attractor',
    group: 'Curves',
    type: AttractorType.Curve,
    options: {
      multiplier: 0.02,
      rotation: new Euler(-215, 0, 0)
    },
    constants: [
      {
        id: 'alpha',
        name: String.raw`$\alpha$`,
        value: 0.2,
        factoryValue: () => 0.2
      },
      {
        id: 'beta',
        name: String.raw`$\beta$`,
        value: 0.2,
        factoryValue: () => 0.2
      },
      {
        id: 'sigma',
        name: String.raw`$\sigma$`,
        value: 5.7,
        factoryValue: () => 5.7
      },
    ],
    calculator: {
      // http://www.3d-meier.de/tut5/Seite6.html
      dX: (vec, consts, multiplier) => (-(vec.y + vec.z)) * multiplier,
      dY: (vec, consts, multiplier) => (vec.x + consts.alpha * vec.y) * multiplier,
      dZ: (vec, consts, multiplier) => (consts.beta + vec.z * (vec.x - consts.sigma)) * multiplier,
    }
  },
  {
    id: 'chua',
    name: 'Chua\'s Circuit',
    group: 'Curves',
    type: AttractorType.Curve,
    options: {
      multiplier: 0.01,
    },
    constants: [
      {
        id: 'alpha',
        name: String.raw`$\alpha$`,
        value: 15.6,
        factoryValue: () => 15.6
      },
      {
        id: 'beta',
        name: String.raw`$\beta$`,
        value: 1,
        factoryValue: () => 1
      },
      {
        id: 'sigma',
        name: String.raw`$\sigma$`,
        value: 25.58,
        factoryValue: () => 25.58
      },
      {
        id: 'i',
        name: String.raw`$i$`,
        value: -1,
        factoryValue: () => -1
      },
      {
        id: 'j',
        name: String.raw`$j$`,
        value: 0,
        factoryValue: () => 0
      }
    ],
    calculator: {
      // http://www.3d-meier.de/tut5/Seite7.html
      dX: (vec, consts, multiplier) => (consts.alpha * (vec.y - vec.x - (consts.j * vec.x + (consts.i + consts.j) * (Math.abs(vec.x + 1) - Math.abs(vec.x - 1))))) * multiplier,
      dY: (vec, consts, multiplier) => (consts.beta * (vec.x - vec.y + vec.z)) * multiplier,
      dZ: (vec, consts, multiplier) => (-(consts.sigma) * vec.y) * multiplier,
    }
  },
  {
    id: 'thomas',
    name: 'Thomas\' cyclically symmetric attractor',
    group: 'Curves',
    type: AttractorType.Curve,
    options: {
      multiplier: 0.3,
      scale: 2
    },
    constants: [
      {
        id: 'b',
        name: String.raw`$b$`,
        value: 0.101,
        factoryValue: () => 0.101,
      },
    ],
    calculator: {
      // https://en.wikipedia.org/wiki/Thomas%27_cyclically_symmetric_attractor
      dX: (vec, consts, multiplier) => (Math.sin(vec.y / 2) - consts.b * vec.x) * multiplier,
      dY: (vec, consts, multiplier) => (Math.sin(vec.z / 2) - consts.b * vec.y) * multiplier,
      dZ: (vec, consts, multiplier) => (Math.sin(vec.x / 2) - consts.b * vec.z) * multiplier,
    }
  },

  // Discrete maps
  {
    id: 'gingerbread',
    name: 'Gingerbread Man Attractor',
    group: 'Points',
    type: AttractorType.Point,
    options: {
      multiplier: 1,
    },
    constants: [
      {
        id: 'x0',
        name: String.raw`$x_0$`,
        value: 2.20819008495389,
        factoryValue: () => random(1, 3)
      },
      {
        id: 'y0',
        name: String.raw`$y_0$`,
        value: 1.387685786876872,
        factoryValue: () => random(1, 3)
      },
    ],
    calculator: {
      // http://www.3d-meier.de/tut5/Seite8.html
      x(i, consts, multiplier, array) {
        if (i <= 0) return (1 - consts.y0 + Math.abs(consts.x0)) * multiplier;

        const bef = array[i - 1];

        return (1 - bef[1] + Math.abs(bef[0])) * multiplier;
      },
      y(i, consts, multiplier, array) {
        if (i <= 0) return consts.x0 * multiplier;

        const bef = array[i - 1];

        return bef[0] * multiplier;
      }
    }
  },
  {
    id: 'henon',
    name: 'Henon Attractor',
    group: 'Points',
    type: AttractorType.Point,
    options: {
      multiplier: 0.5,
    },
    constants: [
      {
        id: 'alpha',
        name: String.raw`$\alpha$`,
        value: 1.4,
        factoryValue: () => 1.4
      },
      {
        id: 'beta',
        name: String.raw`$\beta$`,
        value: 0.3,
        factoryValue: () => 0.3
      },
      {
        id: 'x0',
        name: String.raw`$x_0$`,
        value: 2.20819008495389,
        factoryValue: () => random(1, 3)
      },
      {
        id: 'y0',
        name: String.raw`$y_0$`,
        value: 1.387685786876872,
        factoryValue: () => random(1, 3)
      },
    ],
    calculator: {
      // http://www.3d-meier.de/tut5/Seite8.html
      x(i, consts, multiplier, array) {
        if (i <= 0) return (1 + consts.y0 - consts.alpha * (consts.x0 ** 2)) * multiplier;

        const bef = array[i - 1];

        return (1 + bef[1] - consts.alpha * (bef[0] ** 2)) * multiplier;
      },
      y(i, consts, multiplier, array) {
        if (i <= 0) return (consts.beta * consts.x0) * multiplier;

        const bef = array[i - 1];

        return (consts.beta * bef[0])* multiplier;
      }
    }
  },
] as Attractor[];

export default attractors;