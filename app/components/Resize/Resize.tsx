import React from "react";
import clsx from "clsx";
import { useMouseResize } from "~/hooks";
import { animated } from "@react-spring/web";

interface IResizeProps {
  children: React.ReactNode;
  className?: string;
}

interface IWSizeProps {
  showSize: boolean;
  width: number;
  clientHeight?: number;
}

const WindowSize = ({ showSize, width, clientHeight }: IWSizeProps) => {
  return showSize ? (
    <span className="absolute top-16 text-white/80 text-sm right-6">
      {width} / {clientHeight}
    </span>
  ) : null;
};

const Resize = React.memo(({ children, className }: IResizeProps) => {
  const clientRef = React.useRef<HTMLDivElement>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const { width, showSize } = useMouseResize(700, ref);

  return (
    <animated.div
      className={clsx(className, "relative")}
      style={{ width, minWidth: 400 }}
      ref={clientRef}
    >
      {children}
      <WindowSize
        width={width}
        showSize={showSize}
        clientHeight={clientRef.current?.clientHeight}
      />
      <div
        className="resize-overlay cursor-w-resize w-1 absolute right-0 hover:bg-blue-100"
        style={{ height: "92.4vh", top: "7.6vh" }}
        ref={ref}
      />
    </animated.div>
  );
});

export default Resize;
