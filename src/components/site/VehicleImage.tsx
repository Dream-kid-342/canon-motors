import { useState } from "react";
import { ImageOff } from "lucide-react";
import { photoSrcSet } from "@/lib/inventory";
import { cn } from "@/lib/utils";

/**
 * Listing photo with a fixed 4:3 ratio, responsive renditions where the image
 * host provides them, and a clear fallback when the photo cannot load.
 */
export function VehicleImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw",
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground",
          className,
        )}
      >
        <ImageOff className="h-6 w-6" aria-hidden />
        <span className="text-xs font-medium">Photo unavailable</span>
      </div>
    );
  }
  const srcSet = photoSrcSet(src);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={800}
      height={600}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={cn("aspect-[4/3] w-full bg-muted object-cover", className)}
    />
  );
}
