import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, fn } from "vitest";
import Navbar from "./Navbar";

describe("navbar", () => {
  it("mounts component without crashing", () => {
    render(<Navbar toggleFullscreen={() => {}} />);
  });
  it("input to be rendered and have a default value of ./slides.md", () => {
    render(<Navbar toggleFullscreen={() => {}} />);
    const input = screen.getByTestId("slide-name-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("./slides.md");
  });
  it("calls toggleFullScreen props when clicked", () => {
    const toggleFullScreen = fn();
    render(<Navbar toggleFullscreen={toggleFullScreen} />);
    fireEvent.click(screen.getByText(/Play/i));
    expect(toggleFullScreen).toHaveBeenCalledTimes(1);
  });
});
