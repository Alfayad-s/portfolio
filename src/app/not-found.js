import Link from "next/link";
import { NotFound } from "@/components/ui/not-found";

export const metadata = {
  title: "Page not found",
  description: "The requested page doesn't exist or may have moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh bg-[#e6e6e6]">
      <NotFound
        errorCode="404"
        title="This page took a wrong turn."
        description="The requested page doesn't exist or may have moved."
        actionLabel="Go back home"
        homeHref="/"
        LinkComponent={Link}
        includeDocumentMetadata={false}
        className="text-neutral-950"
        suggestions={[
          { label: "Home", href: "/", description: "Back to the portfolio" },
          { label: "Projects", href: "/#projects", description: "Featured work" },
          { label: "Hire me", href: "https://hirefayad.vercel.app", description: "Start a project together" },
        ]}
      />
    </div>
  );
}
