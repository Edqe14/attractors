import { BsFillGearFill, BsGithub } from 'react-icons/bs';
import { Dispatcher } from '@/types';

interface Props {
  setOpenOptions: Dispatcher<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const Links = ({ setOpenOptions }: Props) => (
  <section className="absolute bottom-0 left-0 pointer-events-auto flex gap-4" >
    <BsFillGearFill className="cursor-pointer" size="1.5rem" onClick={() => setOpenOptions(true)} />
    <a href="https://github.com/Edqe14/attractors" target="_blank" rel="noreferrer">
      <BsGithub className="cursor-pointer" size="1.5rem" />
    </a>
  </section>
);

export default Links;