import { assign, createMachine } from "xstate";

interface IEvent {
  lilslideData: Record<string, any>[];
}

const dataMachine = createMachine(
  {
    id: "data",
    initial: "idle",
    context: {
      lilslideData: [],
    } as IEvent,
    states: {
      idle: {},
    },
    // @ts-expect-error
    on: {
      SAVE: {
        target: ".idle",
        actions: [
          assign({
            lilslideData: (_, event: IEvent) => event.lilslideData,
          }),
          "saveToLocalstorage",
        ],
      },
    },
  },
  {
    actions: {
      saveToLocalstorage(context, event: IEvent) {
        localStorage.setItem(
          "lilslideData",
          JSON.stringify(context.lilslideData)
        );
      },
    },
  }
);

export default dataMachine;
