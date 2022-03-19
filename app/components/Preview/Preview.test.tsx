import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import Preview from "./Preview";

describe("Preview", () => {
  it("mounts component without crashing", () => {
    render(<Preview presentation={false} content="" width={700} />);
  });
});
