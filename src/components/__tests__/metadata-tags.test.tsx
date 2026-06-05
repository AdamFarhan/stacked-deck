import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetadataTags } from "@/components/metadata-tags";

describe("MetadataTags", () => {
  it("renders secondary card tags in source order", () => {
    render(<MetadataTags tags={["Rumble", "Bandle City", "Yordle", "Mech"]} />);

    const tags = screen.getAllByText(/Rumble|Bandle City|Yordle|Mech/);

    expect(screen.getByTestId("metadata-tags")).toBeVisible();
    expect(tags.map((tag) => tag.textContent)).toEqual([
      "Rumble",
      "Bandle City",
      "Yordle",
      "Mech",
    ]);
  });

  it("does not render an empty row when there are no tags", () => {
    render(<MetadataTags tags={[]} />);

    expect(screen.queryByTestId("metadata-tags")).not.toBeInTheDocument();
  });

  it("keeps secondary tags text-only", () => {
    render(<MetadataTags tags={["Gear"]} />);

    expect(screen.getByText("Gear")).toBeVisible();
    expect(screen.queryByTestId("tag-mask-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tag-image-icon")).not.toBeInTheDocument();
  });
});
