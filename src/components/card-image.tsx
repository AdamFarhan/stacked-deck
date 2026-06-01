import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CardImage({
  src,
  alt,
  className,
  priority = false,
  sideways = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sideways?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex aspect-[744/1039] items-center justify-center rounded-md border bg-muted px-4 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-[744/1039] overflow-hidden rounded-[4.5%]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 260px, 80vw"
        className={cn(
          "object-cover",
          sideways && "rotate-90 scale-[1.396] object-contain",
        )}
      />
    </div>
  );
}
