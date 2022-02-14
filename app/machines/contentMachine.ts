import { assign, createMachine } from "xstate";

type IEvent = {
  content: string;
};

const contentMachine = createMachine({
  context: {
    content: "",
  },
  id: "content",
  initial: "idle",
  states: {
    idle: {},
    writing: {
      id: "writing",
    },
  },
  on: {
    CHANGE: {
      target: ".writing",
      actions: assign({ content: (_context, event: IEvent) => event.content }),
    },
  },
});

export default contentMachine;
