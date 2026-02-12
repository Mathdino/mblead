import { useRef, useState, useCallback, useEffect } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  }, []);

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(false);
      if (hasMoved) {
        // Impede que cliques sejam registrados se houve arraste significativo
        e.stopPropagation();
      }
    },
    [hasMoved],
  );

  const onMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !ref.current) return;

      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 2;

      if (Math.abs(x - startX) > 5) {
        setHasMoved(true);
        e.preventDefault();
        ref.current.scrollLeft = scrollLeft - walk;
      }
    },
    [isDragging, scrollLeft, startX],
  );

  return {
    ref,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onMouseMove,
    isDragging,
  };
}
