import Image from "next/image";
import { cn } from "@/lib/utils";

export function CardImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
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
    <div className={cn("relative aspect-[744/1039] overflow-hidden rounded-md border bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 80vw"
        className="object-cover"
      />
    </div>
  );
}
