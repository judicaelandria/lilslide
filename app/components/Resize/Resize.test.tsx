import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Editor from "../Editor";
import Resize from "./Resize";

describe("Resize", () => {
  it("mounts component without crashing", () => {
    render(
      <Resize
        children={
          <Editor getContent={() => {}} getPresentationState={() => {}} />
        }
      />
    );
  });
  it("rendered editor", () => {
    render(
      <Resize
        children={
          <Editor getContent={() => {}} getPresentationState={() => {}} />
        }
      />
    );
    expect(screen.getByTestId("slide-content")).toBeInTheDocument();
  });
});
