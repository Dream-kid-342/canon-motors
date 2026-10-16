import { useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { VehicleImage } from "./VehicleImage";
import { photoVariant } from "@/lib/inventory";
import { cn } from "@/lib/utils";

/** Horizontal swipe detection for touch and pen input. */
function useSwipe(onPrev: () => void, onNext: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      swiped.current = false;
      if (e.pointerType !== "mouse") start.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
        swiped.current = true;
        (dx > 0 ? onPrev : onNext)();
      }
    },
    onPointerCancel: () => (start.current = null),
  };
  /** True (once) if the gesture that produced the current click was a swipe. */
  const wasSwipe = () => {
    const v = swiped.current;
    swiped.current = false;
    return v;
  };
  return { handlers, wasSwipe };
}

const navBtn =
  "absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-md transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function VehicleGallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const n = images.length;
  const prev = useCallback(() => setI((x) => (x - 1 + n) % n), [n]);
  const next = useCallback(() => setI((x) => (x + 1) % n), [n]);
  const swipe = useSwipe(prev, next);
  const lightboxSwipe = useSwipe(prev, next);
  const thumbs = useRef<HTMLDivElement>(null);
  // Element that opened the viewer, so focus can return to it on close.
  const opener = useRef<HTMLElement | null>(null);
  const [loaded, setLoaded] = useState<string | null>(null);
  const openViewer = (e: React.MouseEvent<HTMLElement>) => {
    opener.current = e.currentTarget;
    setOpen(true);
  };

  useEffect(() => {
    thumbs.current
      ?.querySelector<HTMLElement>(`[data-idx="${i}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [i]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, prev, next]);

  const alt = (k: number) => `${title} — photo ${k + 1} of ${n}`;

  return (
    <div className="min-w-0">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} photos`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            next();
          }
        }}
        className="group relative touch-pan-y select-none overflow-hidden rounded-lg border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        {...swipe.handlers}
      >
        <button
          type="button"
          className="block w-full cursor-zoom-in"
          onClick={(e) => !swipe.wasSwipe() && openViewer(e)}
          aria-label="Open full-screen photo viewer"
        >
          <VehicleImage
            key={images[i]}
            src={images[i]}
            alt={alt(i)}
            priority={i === 0}
            sizes="(min-width: 1024px) 720px, 100vw"
          />
        </button>
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className={cn(navBtn, "left-3")}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className={cn(navBtn, "right-3")}
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <div
          className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-graphite/80 px-2.5 py-1 text-xs font-semibold text-graphite-foreground"
          aria-live="polite"
        >
          {i + 1} / {n}
        </div>
        <button
          type="button"
          onClick={openViewer}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-md hover:bg-background"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden /> Full screen
        </button>
      </div>

      {n > 1 && (
        <div
          ref={thumbs}
          className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
          aria-label="Photo thumbnails"
        >
          {images.map((src, k) => (
            <button
              key={src}
              type="button"
              data-idx={k}
              onClick={() => setI(k)}
              aria-label={`Show photo ${k + 1} of ${n}`}
              aria-current={k === i ? "true" : undefined}
              className={cn(
                "h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                k === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={photoVariant(src, "65")}
                alt=""
                width={65}
                height={65}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/95 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex flex-col text-white outline-none"
            aria-describedby={undefined}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              opener.current?.focus();
            }}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <DialogPrimitive.Title className="truncate text-sm font-semibold">
                {title}
              </DialogPrimitive.Title>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums text-white/70">
                  {i + 1} / {n}
                </span>
                <DialogPrimitive.Close
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
                  aria-label="Close photo viewer"
                >
                  <X className="h-5 w-5" />
                </DialogPrimitive.Close>
              </div>
            </div>
            <div
              className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-16"
              {...lightboxSwipe.handlers}
            >
              <img
                key={images[i]}
                src={images[i]}
                alt={alt(i)}
                onLoad={() => setLoaded(images[i] ?? null)}
                className={cn(
                  "max-h-full max-w-full select-none object-contain transition-opacity",
                  loaded === images[i] ? "opacity-100" : "opacity-0",
                )}
                draggable={false}
              />
              {loaded !== images[i] && (
                <span className="absolute text-sm text-white/70" role="status">
                  Loading photo…
                </span>
              )}
              {n > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:left-4"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:right-4"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            <p className="px-4 pb-3 pt-2 text-center text-xs text-white/60">
              Use ← → keys or swipe to browse. Press Esc to close.
            </p>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
