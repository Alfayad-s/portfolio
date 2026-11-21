import CreateLinkPanel from "@/components/admin/create-link-panel";
import { isAdminSession } from "@/lib/admin-auth";
import { listInviteLinks } from "@/lib/invite-links";
import { cookies } from "next/headers";

export const metadata = {
  title: "Create testimonial link",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CreateLinkPage() {
  const jar = await cookies();
  const authed = await isAdminSession(jar.get("admin_session")?.value);
  const links = authed ? await listInviteLinks() : [];

  return (
    <main className="min-h-screen overflow-y-auto px-6 py-10 sm:px-10">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-4xl leading-[0.95] font-extrabold tracking-[-0.045em] text-neutral-950">
          Create a link
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
          Make a private link and send it to a customer. Only that link can add a testimonial, and it works once.
        </p>
        <CreateLinkPanel authed={authed} links={links} />
      </div>
    </main>
  );
}
