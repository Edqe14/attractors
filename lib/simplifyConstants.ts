import { Constants, SimpleConstants } from '@/types';

const simpleConstants = (constants: Constants): SimpleConstants =>
  constants.reduce((acc, v) => ({ ...acc, [v.id]: v.value }), {});

export default simpleConstants;