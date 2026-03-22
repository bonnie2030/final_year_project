import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

type LeafletAutoResizeProps = {
  watch?: Array<unknown>;
};

export default function LeafletAutoResize({ watch = [] }: LeafletAutoResizeProps) {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => map.invalidateSize({ pan: false, debounceMoveend: true });

    // Run after mount and after potential layout/transition completion.
    const t1 = window.setTimeout(invalidate, 0);
    const t2 = window.setTimeout(invalidate, 180);
    const t3 = window.setTimeout(invalidate, 420);

    window.addEventListener('resize', invalidate);

    const container = map.getContainer();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(invalidate) : null;
    if (observer) {
      observer.observe(container);
      if (container.parentElement) observer.observe(container.parentElement);
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener('resize', invalidate);
      observer?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ...watch]);

  return null;
}
