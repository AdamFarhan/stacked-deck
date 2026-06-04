import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardRulesText } from "@/components/card-rules-text";

describe("CardRulesText", () => {
  it("renders keyword, number, and helper icons inline", () => {
    render(
      <CardRulesText text="[Action][>] :rb_energy_1::rb_rune_rainbow:, :rb_rune_calm: :rb_exhaust:: [Stun] an enemy unit." />,
    );

    expect(screen.getByAltText("ACTION")).toHaveAttribute(
      "src",
      "/riftbound-icons/description-keywords/action.svg",
    );
    expect(screen.getByLabelText("1")).toHaveStyle({
      mask: "url(/riftbound-icons/numbers/1.svg) center / contain no-repeat",
    });
    expect(screen.getByAltText("Rainbow Rune")).toHaveAttribute(
      "src",
      "/riftbound-icons/helper-icons/power.webp",
    );
    expect(screen.getByAltText("Calm Rune")).toHaveAttribute(
      "src",
      "/riftbound-icons/domains/calm.webp",
    );
    expect(screen.getByLabelText("Exhaust")).toHaveStyle({
      mask: "url(/riftbound-icons/helper-icons/tap.webp) center / contain no-repeat",
    });
    expect(screen.getByText("Stun")).toBeVisible();
    expect(screen.queryByText(">")).not.toBeInTheDocument();
  });

  it("hides html-escaped arrow markers", () => {
    render(<CardRulesText text="[Action][&gt;] ready." />);

    expect(screen.getByAltText("ACTION")).toBeInTheDocument();
    expect(screen.queryByText("&gt;")).not.toBeInTheDocument();
    expect(screen.queryByText(">")).not.toBeInTheDocument();
  });

  it("renders readable fallbacks for unknown tokens", () => {
    render(<CardRulesText text="[Mystery] :rb_future_symbol:" />);

    expect(screen.getByText("Mystery")).toBeVisible();
    expect(screen.getByText("Future Symbol")).toBeVisible();
  });

  it("preserves multiline text", () => {
    render(<CardRulesText text={"[Action]\nSecond line"} />);

    expect(screen.getByText("Second line")).toBeVisible();
    expect(document.querySelector("br")).toBeInTheDocument();
  });
});
