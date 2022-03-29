import { Button, Checkbox, Collapse, ColorInput, Drawer, InputWrapper, NumberInput, Select , Slider, Space } from '@mantine/core';
import { showNotification, useNotifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { BsFillGearFill } from 'react-icons/bs';
import { useStore } from '@/hooks/store';
import Markdown from './Markdown';


const Overlay = () => {
  const data = useStore();
  const notifs = useNotifications();

  const [debug, setDebug] = useState<boolean>(process.env.NODE_ENV === 'development');
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [expandConstants, setExpandConstants] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage.getItem('debug')) setDebug(true);
  }, []);

  const resetConstants = () => {
    if (data.activeAttractor) {
      data.activeAttractor.constants.forEach((v, i) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data.activeAttractor!.constants[i].value = data.activeAttractor!.constants[i].factoryValue();
      });
    }
  };

  const setActive = (val: string) => {
    const index = data.attractors.findIndex((a) => a.id === val);
    if (index === -1) return;

    data.setIndex(index);
  };

  const handleMaxPoints = (val: number) => {
    if (val > 7500 && !notifs.notifications.some((no) => no.id === 'high-max-points')) {
      showNotification({
        id: 'high-max-points',
        title: 'Warning!',
        message: 'Too high max. points will eventually slow down the visualizer and could hang up the tab',
        color: 'red'
      });
    }

    data.setMaxPoints(val);
  };

  return (
    <section className="absolute top-0 left-0 h-full w-full z-10 text-white p-8 pointer-events-none">
      <div className="relative h-full">
        {debug && (
          <section className="mb-4 absolute right-0 pointer-events-auto">
            <p className="text-lg font-semibold">DEBUG</p>

            <section className="text-gray-200">
              <p className="font-mono">points: {data.points.length} | max: {data.maxPoints}</p>
              <p className="font-mono">multiplier: {data.multiplier}</p>
              <p className="font-mono">scale: {data.scale.toFixed(2)} | line width: {data.lineWidth.toFixed(2)} | color: {data.color}</p>
              <p className="font-mono">auto rotate: {data.autoRotate.toString()} | speed: {data.autoRotateSpeed.toFixed(2)}</p>
            </section>
          </section>
        )}

        <section className="max-w-xs pointer-events-auto filter drop-shadow-sm">
          <Select className="mb-4" label="Attractor" data={data.attractors.map((a) => ({ value: a.id, label: a.name, group: a.group }))} value={data.activeAttractor?.id} onChange={setActive} />

          <InputWrapper
            label={(
              <span className="flex items-center" onClick={() => setExpandConstants(!expandConstants)}>
                <p>Constants</p>

                <Space w="md" />

                <p className={`text-xs ${expandConstants ? 'text-red-500' : 'text-green-500'}`}>{expandConstants ? 'Hide' : 'Expand'}</p>
              </span>
            )}
          >
            <Collapse in={expandConstants}>
              {data.activeAttractor?.constants.map((v, i) => (
                <NumberInput
                  value={v.value}
                  key={v.id}
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion,no-return-assign
                  onChange={(val) => data.activeAttractor!.constants[i].value = val ?? 0}
                  precision={3}
                  step={0.001}
                  icon={<Markdown>{v.name}</Markdown>}
                  className="mb-2"
                />
              ))}
            </Collapse>
          </InputWrapper>

          <Button color="red" className="mt-2" onClick={resetConstants}>Reset</Button>
        </section>

        <BsFillGearFill size="1.5rem" className="cursor-pointer absolute bottom-0 left-0 pointer-events-auto" onClick={() => setOpenOptions(true)} />

        <Drawer opened={openOptions} onClose={() => setOpenOptions(false)} title="Settings" padding="xl" size="xl">
          <ColorInput className="mb-4" value={data.color} label="Color" onChange={data.setColor} />

          <InputWrapper className="mb-4" label="Max. Points">
            <Slider
              marks={[
                { value: 500, label: '500' },
                { value: 1000, label: '1,000' },
                { value: 2500, label: '2,000' },
                { value: 5000, label: '5,000' },
                { value: 7500, label: '7,500' },
                { value: 10000, label: '10,000' },
                { value: 15000, label: '15,000' },
                { value: 20000, label: '20,000' },
              ]}
              min={500}
              max={20000}
              value={data.maxPoints}
              onChange={handleMaxPoints}
              step={100}
              styles={{ markLabel: { display: 'none' } }}
              labelTransition="skew-down"
              labelTransitionDuration={150}
              labelTransitionTimingFunction="ease-in-out"
            />
          </InputWrapper>

          <InputWrapper className="mb-4" label="Scale">
            <Slider
              marks={[
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1' },
                { value: 1.5, label: '1.5' },
                { value: 2, label: '2' },
              ]}
              min={0.5}
              max={2}
              value={data.scale}
              onChange={data.setScale}
              step={0.01}
              label={(value) => value.toFixed(2)}
              styles={{ markLabel: { display: 'none' } }}
              labelTransition="skew-down"
              labelTransitionDuration={150}
              labelTransitionTimingFunction="ease-in-out"
            />
          </InputWrapper>

          <InputWrapper className="mb-4" label="Line Width">
            <Slider
              marks={[
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1' },
                { value: 1.5, label: '1.5' },
                { value: 2, label: '2' },
              ]}
              min={0.5}
              max={2}
              value={data.lineWidth}
              onChange={data.setLineWidth}
              step={0.01}
              label={(value) => value.toFixed(2)}
              styles={{ markLabel: { display: 'none' } }}
              labelTransition="skew-down"
              labelTransitionDuration={150}
              labelTransitionTimingFunction="ease-in-out"
            />
          </InputWrapper>

          <InputWrapper className="mb-4" label="Auto Rotate">
            <Checkbox label="Enable" className="mb-1" checked={data.autoRotate} onChange={(ev) => data.setAutoRotate(ev.currentTarget.checked)} />

            {data.autoRotate && (
              <InputWrapper label="Speed" className="pl-8">
                <Slider
                  marks={[
                    { value: 0.5, label: '0.5' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                    { value: 5, label: '5' },
                  ]}
                  min={0.5}
                  max={5}
                  value={data.autoRotateSpeed}
                  onChange={data.setAutoRotateSpeed}
                  step={0.01}
                  label={(value) => value.toFixed(2)}
                  styles={{ markLabel: { display: 'none' } }}
                  labelTransition="skew-down"
                  labelTransitionDuration={150}
                  labelTransitionTimingFunction="ease-in-out"
                />
              </InputWrapper>
            )}
          </InputWrapper>
        </Drawer>
      </div>
    </section>
  );
};

export default Overlay;