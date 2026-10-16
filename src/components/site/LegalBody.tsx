/** Typography wrapper for long-form legal pages. */
export function LegalBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page max-w-3xl py-12 text-[15px] leading-relaxed text-muted-foreground [&_h2]:mb-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-foreground [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </div>
  );
}
