import { Button, Checkbox, Collapse, ColorInput, Drawer, InputWrapper, NumberInput, Select , Slider, Space } from '@mantine/core';
import { showNotification, useNotifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks/store';
import Markdown from './Markdown';
import Links from './Links';

const Overlay = () => {
  const data = useStore();
  const notifs = useNotifications();

  const [debug, setDebug] = useState<boolean>(process.env.NODE_ENV === 'development');
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [expandConstants, setExpandConstants] = useState<boolean>(false);

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
          <section className="mb-4 absolute right-0 pointer-events-auto opacity-25 hover:opacity-50 transition-opacity ease-in-out duration-200">
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
          {/* Disabled non-curves attractor due to slow processing and bugs */}
          <Select className="mb-4" label="Attractor" data={data.attractors.map((a) => ({ value: a.id, label: a.name, group: a.group, disabled: a.group?.toLowerCase() !== 'curves' }))} value={data.activeAttractor?.id} onChange={setActive} />

          <InputWrapper
            label={(
              <span className="flex items-center" onClick={() => setExpandConstants(!expandConstants)}>
                <p>Constants</p>

                <Space w="md" />

                <p className={`text-xs ${expandConstants ? 'text-red-500' : 'text-green-500'}`}>
                  {expandConstants ? 'Hide' : 'Expand'}
                </p>
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

              <Button color="red" className="mt-2" onClick={resetConstants}>Reset</Button>
            </Collapse>
          </InputWrapper>
        </section>

        <Links setOpenOptions={setOpenOptions} />

        <Drawer opened={openOptions} onClose={() => setOpenOptions(false)} title="Settings" padding="xl" size="xl">
          <ColorInput className="mb-4" value={data.color} label="Color" onChange={data.setColor} />

          <InputWrapper className="mb-4" label="Max. Points">
            <Slider
              marks={[
                { value: 500 },
                { value: 1000 },
                { value: 2500 },
                { value: 5000 },
                { value: 7500 },
                { value: 10000 },
                { value: 15000 },
                { value: 20000 },
                { value: 30000 },
                { value: 40000 },
                { value: 50000 },
              ]}
              min={500}
              max={50000}
              value={data.maxPoints}
              onChange={handleMaxPoints}
              step={100}
              styles={{ markLabel: { display: 'none' } }}
              label={(value) => value.toLocaleString('en-US')}
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

          <InputWrapper className="mb-4" label="Trailing Color">
            <Checkbox label="Enable" disabled className="mb-1" checked={data.multiColor} onChange={(ev) => data.setMultiColor(ev.currentTarget.checked)} />
          </InputWrapper>
        </Drawer>
      </div>
    </section>
  );
};

export default Overlay;