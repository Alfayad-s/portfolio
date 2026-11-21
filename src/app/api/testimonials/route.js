import { addTestimonial } from "@/lib/testimonials";
import { NextResponse } from "next/server";

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Send a name, role, message, and photo." }, { status: 400 });
  }

  try {
    const result = await addTestimonial({
      name: form.get("name"),
      role: form.get("role"),
      message: form.get("message"),
      companyWebsite: form.get("companyWebsite"),
      token: form.get("token"),
      image: form.get("image"),
    });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ testimonial: result.testimonial }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save that testimonial." }, { status: 500 });
  }
}
