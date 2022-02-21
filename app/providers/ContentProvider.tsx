import React from "react";
import { useInterpret } from "@xstate/react";
import { contentMachine } from "~/machines";
import { ContentContext } from "~/contexts";

export const ContentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const contentService = useInterpret(contentMachine);
  return (
    <ContentContext.Provider value={{ contentService }}>
      {children}
    </ContentContext.Provider>
  );
};
