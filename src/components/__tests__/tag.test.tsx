import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tag } from "@/components/tag";

describe("Tag", () => {
  it("renders a masked icon for monochrome tag assets", () => {
    render(<Tag value="Gear" />);

    expect(screen.getByText("Gear")).toBeVisible();
    expect(screen.getByTestId("tag-mask-icon")).toHaveStyle({
      mask: "url(/riftbound-icons/card-types/gear.webp) center / contain no-repeat",
    });
  });

  it("renders an image icon for colored tag assets", () => {
    render(<Tag value="Fury" />);

    expect(screen.getByText("Fury")).toBeVisible();
    expect(screen.getByTestId("tag-image-icon")).toHaveAttribute(
      "src",
      "/riftbound-icons/domains/fury.webp",
    );
  });

  it("renders a text-only badge when a tag has no matching icon", () => {
    render(<Tag value="Assault" />);

    expect(screen.getByText("Assault")).toBeVisible();
    expect(screen.queryByTestId("tag-mask-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tag-image-icon")).not.toBeInTheDocument();
  });

  it("uses an explicit label without changing the icon lookup value", () => {
    render(<Tag value="Gear" label="Equipment" />);

    expect(screen.getByText("Equipment")).toBeVisible();
    expect(screen.getByTestId("tag-mask-icon")).toBeInTheDocument();
  });
});
