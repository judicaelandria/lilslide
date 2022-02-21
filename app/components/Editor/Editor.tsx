import React from "react";
import { useActor } from "@xstate/react";

import { ContentContext } from "~/contexts";
import { Navbar } from "..";

interface IEditorProps {
  getPresentationState: () => void;
}

const Editor = React.memo(({ getPresentationState }: IEditorProps) => {
  const [content, setContent] = React.useState("");
  const globalServices = React.useContext(ContentContext);
  const [_, send] = useActor(globalServices.contentService);

  const toggleFullscreen = () => getPresentationState();

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
    send({ type: "CHANGE", content: event.target.value });
  };

  return (
    <div className="w-full h-full relative">
      <div
        className="sticky top-0 left-0"
        style={{ width: "inherit", maxWidth: "inherit" }}
      >
        <Navbar toggleFullscreen={toggleFullscreen} />
      </div>
      <textarea
        value={content}
        onChange={handleContentChange}
        className="pt-1 pl-2 text-lg w-full border-none bg-darkBlue text-white overflow-y-auto focus:outline-none resize-none"
        style={{ height: "91.7vh" }}
        id="editor"
      />
      <div
        className="absolute right-4 bg-blue-100/60"
        style={{ height: "92.4vh", top: "7.6vh", zIndex: 0, width: "0.5px" }}
      />
    </div>
  );
});

export default Editor;
