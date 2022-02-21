import React from "react";
import { InterpreterFrom } from "xstate";
import { contentMachine } from "~/machines";

const ContentContext = React.createContext({
  contentService: {} as InterpreterFrom<typeof contentMachine>,
});

export default ContentContext;
