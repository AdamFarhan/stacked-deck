import React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { getTagIcon } from "@/lib/card-icons";
import { cn } from "@/lib/utils";

export type TagProps = {
  value: string;
  label?: string;
  variant?: BadgeProps["variant"];
  className?: string;
};

export function Tag({ value, label, variant = "secondary", className }: TagProps) {
  const icon = getTagIcon(value);
  const displayLabel = label ?? icon?.label ?? value;

  return (
    <Badge
      variant={variant}
      className={cn("gap-2 px-3 py-1.5 text-sm tracking-normal", className)}
    >
      {icon ? <TagIcon path={icon.path} mode={icon.mode} label={icon.label} /> : null}
      <span>{displayLabel}</span>
    </Badge>
  );
}

function TagIcon({
  path,
  mode,
  label,
}: {
  path: string;
  mode: "image" | "mask";
  label: string;
}) {
  if (mode === "mask") {
    return (
      <span
        aria-hidden="true"
        className="h-[18px] w-[18px] shrink-0 bg-current"
        data-testid="tag-mask-icon"
        style={{
          WebkitMask: `url(${path}) center / contain no-repeat`,
          mask: `url(${path}) center / contain no-repeat`,
        }}
      />
    );
  }

  return (
    <img
      src={path}
      alt=""
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0 object-contain"
      data-testid="tag-image-icon"
      title={label}
    />
  );
}
