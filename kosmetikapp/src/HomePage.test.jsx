import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("zeigt alle vier Produktkategorien an", () => {
    render(<HomePage />);

    expect(screen.getByText("Make up")).toBeTruthy();
    expect(screen.getByText("Hautpflege")).toBeTruthy();
    expect(screen.getByText("Haarpflege")).toBeTruthy();
    expect(screen.getByText("Haushalt")).toBeTruthy();
  });
});