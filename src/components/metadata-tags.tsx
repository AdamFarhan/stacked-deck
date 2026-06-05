import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function MetadataTags({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Card tags"
      className={cn("mt-3 flex flex-wrap gap-1.5", className)}
      data-testid="metadata-tags"
    >
      {tags.map((tag) => (
        <MetadataTag key={tag} value={tag} />
      ))}
    </div>
  );
}

export function MetadataTag({ value }: { value: string }) {
  return (
    <Badge
      variant="outline"
      className="border-border/80 bg-background/70 px-2 py-0.5 text-xs font-medium text-muted-foreground shadow-none"
    >
      {value}
    </Badge>
  );
}
