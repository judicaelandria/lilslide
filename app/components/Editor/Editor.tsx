import { useMachine } from "@xstate/react";
import React from "react";
import { contenMachine } from "~/machines";
import { Navbar } from "..";

const Editor = () => {
  const [content, setContent] = React.useState("");
  const [_, send] = useMachine(contenMachine);

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
    send({ type: "CHANGE", content: event.target.value });
  };

  return (
    <div className="h-full relative">
      <div className="fixed top-0 left-0 w-2/4">
        <Navbar />
      </div>
      <textarea
        value={content}
        onChange={handleContentChange}
        className="pt-20 pl-4 text-lg w-full h-full border-none bg-darkBlue text-white overflow-y-auto focus:outline-none resize-none"
      />
    </div>
  );
};

export default Editor;
