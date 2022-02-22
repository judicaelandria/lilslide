import React from "react";
import {
  createUseGesture,
  dragAction,
  moveAction,
  pinchAction,
} from "@use-gesture/react";

const useGesture = createUseGesture([dragAction, pinchAction, moveAction]);

export const useMouseResize = (
  initialWidth: number,
  ref: React.RefObject<HTMLDivElement>
) => {
  const [width, setWidth] = React.useState(initialWidth);
  const [showSize, setShowSize] = React.useState(false);
  const dragging = React.useRef(false);
  const pointerRef = React.useRef(false);

  React.useEffect(() => {
    const handler = (e: any) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  useGesture(
    {
      onPointerMove: () => {
        if (!dragging.current) {
          return;
        } else {
          pointerRef.current = true;
        }
      },
      onDrag: ({ event }) => {
        if (pointerRef.current) {
          const { clientX } = event as PointerEvent;
          setWidth((prevWidth) => {
            const latestWidth = Math.floor(clientX);
            if (latestWidth <= 400) return 400;
            return prevWidth + (latestWidth - prevWidth);
          });
          setShowSize(true);
        }
      },
      onPointerDown: () => {
        dragging.current = true;
      },
      onPointerUp: () => {
        setShowSize(false);
        pointerRef.current = false;
      },
    },
    {
      target: ref,
    }
  );
  return { width, showSize };
};
