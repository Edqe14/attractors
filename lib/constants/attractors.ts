import { Euler } from 'three';
import { Attractor, AttractorType } from '@/types';

const attractors = [
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
] as Attractor[];

export default attractors;