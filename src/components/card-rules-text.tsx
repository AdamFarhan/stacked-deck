import React from "react";
import { getRulesIconForToken } from "@/lib/rules-icons";
import {
  formatUnknownColonToken,
  parseRulesText,
  type RulesTextToken,
} from "@/lib/rules-text";
import { cn } from "@/lib/utils";

export function CardRulesText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const tokens = parseRulesText(text);

  return (
    <div className={cn("text-md", className)}>
      {tokens.map((token, index) => (
        <RulesTextTokenView key={`${token.type}-${index}`} token={token} />
      ))}
    </div>
  );
}

function RulesTextTokenView({ token }: { token: RulesTextToken }) {
  if (token.type === "hidden") {
    return null;
  }

  if (token.type === "lineBreak") {
    return <br />;
  }

  if (token.type === "text") {
    return <>{token.value}</>;
  }

  if (token.type === "keyword") {
    const icon = getRulesIconForToken("bracket", token.value);

    if (!icon) {
      return <FallbackRulesPill>{token.value}</FallbackRulesPill>;
    }

    return (
      <img
        src={icon.path}
        alt={icon.label}
        className="mx-0.5 inline-block h-[1.35em] w-auto align-[-0.28em]"
        data-testid="rules-keyword-icon"
      />
    );
  }

  const icon = getRulesIconForToken("colon", token.value);

  if (!icon) {
    return (
      <FallbackRulesPill>
        {formatUnknownColonToken(token.value)}
      </FallbackRulesPill>
    );
  }

  if (icon.mode === "image") {
    return (
      <img
        src={icon.path}
        alt={icon.label}
        className="mx-0.5 inline-block h-[1.15em] w-[1.15em] object-contain align-[-0.16em]"
        data-testid={`rules-${icon.kind}-icon`}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={icon.label}
      className={cn(
        "inline-block bg-current",
        icon.kind === "number"
          ? "h-[1.35em] w-[1.35em] align-[-0.25em]"
          : "h-[1.15em] w-[1.15em] align-[-0.16em]",
      )}
      data-testid={`rules-${icon.kind}-icon`}
      style={{
        WebkitMask: `url(${icon.path}) center / contain no-repeat`,
        mask: `url(${icon.path}) center / contain no-repeat`,
      }}
    />
  );
}

function FallbackRulesPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex items-center rounded-sm bg-secondary px-1.5 py-0.5 text-xs font-semibold text-secondary-foreground">
      {children}
    </span>
  );
}
