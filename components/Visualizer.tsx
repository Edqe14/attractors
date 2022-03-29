import { Canvas } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import { useStore } from '@/hooks/store';
import Camera from '@/components/Camera';
import Pen from '@/components/Pen';

const Visualizer = () => {
  const data = useStore();

  return (
    <Canvas gl={{ alpha: true }}>
      <ambientLight />
      <Camera data={data} />
      <Pen data={data} />

      <EffectComposer>
        <Vignette eskil={false} darkness={0.5} />
      </EffectComposer>

      <GizmoHelper renderPriority={2}>
        <GizmoViewport />
      </GizmoHelper>
    </Canvas>
  );
};

export default Visualizer;