import TestimonialForm from "@/components/testimonials/testimonial-form";
import { findInviteLink } from "@/lib/invite-links";

export const dynamic = "force-dynamic";

const shareImage = {
  url: "/testimonial-og-image.png",
  width: 1672,
  height: 941,
  alt: "How was your experience working with Alfayad?",
  type: "image/png",
};

function customerName(link) {
  const name = link?.label?.trim();
  if (!name || name === "Customer") return "";
  return name;
}

export async function generateMetadata({ params }) {
  const { token } = await params;
  const link = await findInviteLink(token);
  const name = customerName(link);
  const title = name
    ? `${name}, how was your experience with Alfayad?`
    : "How was your experience working with Alfayad?";
  const description = name
    ? `${name}, your honest feedback helps Alfayad grow and serve you better. Share a short testimonial about working together.`
    : "Your honest feedback helps Alfayad grow and serve you better. Share a short testimonial about working together.";

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `/testimonials/${token}`,
      siteName: "Alfayad",
      type: "website",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage.url],
    },
  };
}

export default async function InviteTestimonialPage({ params }) {
  const { token } = await params;
  const link = await findInviteLink(token);

  return (
    <main className="min-h-screen overflow-y-auto px-6 py-10 sm:px-10">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-4xl leading-[0.95] font-extrabold tracking-[-0.045em] text-neutral-950">
          Add a testimonial
        </h1>
        {!link ? (
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">This link is not valid.</p>
        ) : link.usedAt ? (
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">This link has already been used.</p>
        ) : (
          <>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
              Leave a short note about working with Alfayad. This page is only open from the link you were sent.
            </p>
            <div className="mt-8">
              <TestimonialForm token={token} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
