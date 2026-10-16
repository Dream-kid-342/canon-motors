import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Canon Motors — Japanese Vehicle Importer, Mombasa" },
    { name: "description", content: "Canon Motors Ltd. imports quality used Japanese vehicles for buyers in Kenya and abroad, based on Moi Avenue, Mombasa." },
    { property: "og:title", content: "About Canon Motors" },
    { property: "og:description", content: "Japanese vehicle importer based in Mombasa, Kenya." },
  ] }),
  component: () => (
    <>
      <PageHeader title="About Canon Motors" crumb="About" />
      <div className="container-page max-w-3xl space-y-4 py-10 text-lg leading-relaxed text-muted-foreground">
        <p>Canon Motors Ltd. is a Mombasa-based importer of used Japanese vehicles, offering stock held in Japan as well as vehicles already in transit to Kenya.</p>
        <p>Our inventory covers SUVs, station wagons, hatchbacks, mini vans, vans, pickups, trucks and buses from makers such as Toyota, Nissan, Suzuki, Mazda, Daihatsu and Honda.</p>
        <p>Every vehicle is listed with its stock reference, chassis number and grade so you know exactly what you are enquiring about.</p>
        <Link to="/contact" className="inline-block font-semibold text-primary hover:underline">Contact our team →</Link>
      </div>
    </>
  ),
});
