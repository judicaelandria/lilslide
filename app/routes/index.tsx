import { useMachine } from "@xstate/react";
import React from "react";
import type { LinksFunction } from "remix";
import { Editor, Preview } from "~/components";
import Resize from "~/components/Resize";
import dataMachine from "~/machines/dataMachine";
import { Provider } from "~/providers";
import styles from "~/styles/markdown.css";
import editorStyles from "~/styles/editor.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: editorStyles },
  ];
};

export default function Index() {
  const [presentationState, setPresentationState] = React.useState(false);
  const [previewWidth, setPreviewWidth] = React.useState<number>(0);
  const [current, send] = useMachine(dataMachine);
  const { lilslideData } = current.context;
  const containerRef = React.useRef<HTMLElement>(null);

  const getPresentationState = () => {
    setPresentationState(true);
  };

  const getPreviewWidth = (width: number) => {
    setPreviewWidth(containerRef.current!.clientWidth - width);
  };

  const togglePresentationMode = (event: KeyboardEvent) => {
    if (event.key === "F8") setPresentationState(true);
  };

  const bundleShortcut = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "s") {
      event.preventDefault();
      lilslideData.push({
        id: lilslideData.length + 1,
        name: "test",
        content: "content",
      });
      send({ type: "SAVE", lilslideData });
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", togglePresentationMode);
    return () => window.removeEventListener("keydown", togglePresentationMode);
  }, []);

  React.useEffect(() => {
    setTimeout(() => setPresentationState(false), 1000);
  }, [presentationState]);

  React.useEffect(() => {
    window.addEventListener("keydown", bundleShortcut);
    return () => window.removeEventListener("keydown", bundleShortcut);
  }, []);

  return (
    <Provider>
      <main className="w-full min-h-screen">
        <article className="w-full flex" ref={containerRef}>
          <Resize
            className="min-h-screen bg-darkBlue"
            getPreviewWidth={getPreviewWidth}
          >
            <Editor getPresentationState={getPresentationState} />
          </Resize>
          <Preview presentation={presentationState} width={previewWidth} />
        </article>
      </main>
    </Provider>
  );
}
