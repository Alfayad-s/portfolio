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
    <main className="min-h-dvh overflow-y-auto px-4 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-[2rem] leading-[0.95] font-extrabold tracking-[-0.045em] text-neutral-950 sm:text-4xl">
          Add a testimonial
        </h1>
        {!link ? (
          <div className="mt-6 rounded-[28px] bg-white px-5 py-8 ring-1 ring-black/5 sm:px-6">
            <p className="text-lg font-semibold text-neutral-950">This link is not valid</p>
            <p className="mt-2 text-base leading-relaxed text-neutral-600">
              Ask Alfayad for a new testimonial link.
            </p>
            <a
              href="mailto:alfayadshameer056@gmail.com?subject=New%20testimonial%20link"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-base font-medium text-white sm:w-max"
            >
              Request a new link
            </a>
          </div>
        ) : link.usedAt ? (
          <div className="mt-6 rounded-[28px] bg-white px-5 py-8 ring-1 ring-black/5 sm:px-6">
            <p className="text-lg font-semibold text-neutral-950">This link has already been used</p>
            <p className="mt-2 text-base leading-relaxed text-neutral-600">
              A testimonial was already submitted with this link. Each link works once. Request a new one from Alfayad.
            </p>
            <a
              href="mailto:alfayadshameer056@gmail.com?subject=New%20testimonial%20link"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-base font-medium text-white sm:w-max"
            >
              Request a new link
            </a>
          </div>
        ) : (
          <div className="mt-6 sm:mt-8">
            <TestimonialForm token={token} />
          </div>
        )}
      </div>
    </main>
  );
}
