import React from "react";
import type { LinksFunction } from "remix";
import { Editor, Preview } from "~/components";
import Resize from "~/components/Resize";
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
  const containerRef = React.useRef<HTMLElement>(null);
  const [content, setContent] = React.useState<string>("");

  const getPresentationState = () => {
    setPresentationState(true);
  };

  const getPreviewWidth = (width: number) => {
    setPreviewWidth(containerRef.current!.clientWidth - width);
  };

  const togglePresentationMode = (event: KeyboardEvent) => {
    if (event.key === "F8") setPresentationState(true);
  };

  React.useEffect(() => {
    window.addEventListener("keydown", togglePresentationMode);
    return () => window.removeEventListener("keydown", togglePresentationMode);
  }, []);

  React.useEffect(() => {
    setTimeout(() => setPresentationState(false), 1000);
  }, [presentationState]);

  return (
    <main className="w-full min-h-screen">
      <article className="w-full flex" ref={containerRef}>
        <Resize
          className="min-h-screen bg-darkBlue"
          getPreviewWidth={getPreviewWidth}
        >
          <Editor
            getPresentationState={getPresentationState}
            getContent={setContent}
          />
        </Resize>
        <Preview
          presentation={presentationState}
          width={previewWidth}
          content={content}
        />
      </article>
    </main>
  );
}
