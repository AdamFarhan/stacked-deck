import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CardImage } from "@/components/card-image";

vi.mock("next/image", () => ({
  default: ({ alt, className, src }: { alt: string; className?: string; src: string }) => (
    <img alt={alt} className={className} src={src} />
  ),
}));

describe("CardImage", () => {
  it("renders normal card art without rotation", () => {
    render(<CardImage src="https://example.com/card.png" alt="Normal card" />);

    const image = screen.getByAltText("Normal card");

    expect(image).toHaveClass("object-cover");
    expect(image).not.toHaveClass("rotate-90");
    expect(image).not.toHaveClass("scale-[0.716]");
  });

  it("rotates and scales sideways card art", () => {
    render(<CardImage src="https://example.com/battlefield.png" alt="Battlefield card" sideways />);

    const image = screen.getByAltText("Battlefield card");

    expect(image).not.toHaveClass("object-cover");
    expect(image).toHaveClass("rotate-90");
    expect(image).toHaveClass("scale-[1.396]");
    expect(image).toHaveClass("object-contain");
  });

  it("keeps missing-image fallback readable when sideways is true", () => {
    render(<CardImage src={null} alt="Missing battlefield" sideways />);

    expect(screen.getByText("Image unavailable")).toBeVisible();
    expect(screen.queryByAltText("Missing battlefield")).not.toBeInTheDocument();
  });
});
