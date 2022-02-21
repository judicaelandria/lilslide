import React from "react";
import { ContentProvider } from "./ContentProvider";

interface IProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: IProviderProps) => {
  return <ContentProvider>{children}</ContentProvider>;
};

export default Provider;
