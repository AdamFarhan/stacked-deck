import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdvancedSearchForm } from "@/components/advanced-search-form";
import { getDefaultAdvancedSearchFilters } from "@/lib/search";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("AdvancedSearchForm", () => {
  it("renders selected query params and shadcn-backed controls", () => {
    render(
      <AdvancedSearchForm
        filters={{
          ...getDefaultAdvancedSearchFilters(),
          query: "Master Yi",
          domains: ["Body"],
          sets: ["UNL"],
          types: ["Unit"],
          rarities: ["Rare"],
          energy: [2, 6],
        }}
        sets={[{ code: "UNL", name: "Unleashed" }]}
      />,
    );

    expect(screen.getByLabelText("Search cards")).toHaveValue("Master Yi");
    expect(screen.getByRole("button", { name: "Body" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Domain")).toBeVisible();
    expect(screen.getAllByText("1 selected")).toHaveLength(3);
    expect(screen.getByText("2-6")).toBeVisible();
    expect(screen.getByRole("button", { name: /search/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /reset/i })).toBeVisible();
  });
});
