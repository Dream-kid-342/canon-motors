import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, STEPS } from "@/components/site/PageHeader";

export const Route = createFileRoute("/how-importing-works")({
  head: () => ({ meta: [
    { title: "How Importing Works — Canon Motors" },
    { name: "description", content: "How buying and importing a Japanese vehicle to Mombasa with Canon Motors works, step by step." },
    { property: "og:title", content: "How Importing Works — Canon Motors" },
    { property: "og:description", content: "From choosing a vehicle in Japan to arrival in Mombasa." },
  ] }),
  component: () => (
    <>
      <PageHeader title="How Importing Works" crumb="How Importing Works">A simple overview. Contact us for exact costs and timelines for your vehicle.</PageHeader>
      <ol className="container-page max-w-3xl space-y-4 py-10">
        {STEPS.map((s, i) => (
          <li key={s.t} className="flex gap-5 rounded-lg border bg-card p-6">
            <span className="text-2xl font-extrabold text-primary">0{i + 1}</span>
            <div><h2 className="font-bold">{s.t}</h2><p className="mt-1 text-muted-foreground">{s.d}</p></div>
          </li>
        ))}
        <li className="pt-4"><Link to="/contact" className="font-semibold text-primary hover:underline">Ask us about importing →</Link></li>
      </ol>
    </>
  ),
});
