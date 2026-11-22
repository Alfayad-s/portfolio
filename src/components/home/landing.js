import { listTestimonials } from "@/lib/testimonials";
import CurrentCompany from "@/components/home/current-company";
import HeroLine from "@/components/home/hero-line";
import SpotlightRow from "@/components/home/spotlight-row";
import TechStack from "@/components/home/tech-stack";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Download, LayoutGrid } from "lucide-react";
import ThemeToggle from "@/components/home/theme-toggle";
import { TbBrandFacebook, TbBrandGithub, TbBrandInstagram, TbBrandLinkedin, TbBrandX } from "react-icons/tb";

const socials = [
  { name: "Instagram", href: "https://instagram.com/alfayads", Icon: TbBrandInstagram },
  { name: "X", href: "https://x.com/alfayad", Icon: TbBrandX },
  { name: "Facebook", href: "https://facebook.com/alfayad", Icon: TbBrandFacebook },
  { name: "LinkedIn", href: "https://linkedin.com/in/alfayad", Icon: TbBrandLinkedin },
  { name: "GitHub", href: "https://github.com/Alfayad-s", Icon: TbBrandGithub },
];

const featured = [
  {
    title: "FAYAD AI",
    description: "A personal AI assistant",
    image: "/project-thumbnail/fayad-ai.jpg",
    href: "https://fayad-ai.vercel.app",
    tone: "dark",
  },
  {
    title: "TraceX",
    description: "Expense tracking app",
    image: "/project-thumbnail/tracex.jpg",
    href: "https://tracexx.vercel.app",
    tone: "dark",
  },
  {
    title: "Yaadro",
    description: "Delivery management",
    image: "/project-thumbnail/yaadro.jpg",
    href: "https://yaadro.ae",
    tone: "light",
  },
];

const CUT = 20;

function fillet(origin) {
  return `radial-gradient(circle at ${origin}, transparent ${CUT}px, #fff ${CUT + 0.5}px)`;
}

function BottomCuts() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0"
        style={{
          left: -CUT,
          width: CUT + 1,
          height: CUT + 1,
          background: fillet("0 0"),
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0"
        style={{
          right: -CUT,
          width: CUT + 1,
          height: CUT + 1,
          background: fillet("100% 0"),
        }}
      />
    </>
  );
}

function EdgeCut({ side }) {
  const edge = side === "left" ? { left: 0 } : { right: 0 };
  const topOrigin = side === "left" ? "100% 0" : "0 0";
  const bottomOrigin = side === "left" ? "100% 100%" : "0 100%";

  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          ...edge,
          top: -CUT,
          width: CUT,
          height: CUT + 1,
          background: fillet(topOrigin),
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          ...edge,
          bottom: -CUT,
          width: CUT,
          height: CUT + 1,
          background: fillet(bottomOrigin),
        }}
      />
    </>
  );
}

function ProjectCard({ project, className = "" }) {
  const light = project.tone === "light";

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className={`group relative block h-[156px] w-full overflow-hidden rounded-[24px] transition duration-300 hover:-translate-y-1 sm:w-[210px] ${
        light ? "bg-white ring-1 ring-black/5" : "bg-neutral-950"
      } ${className}`}
    >
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 240px, 100vw"
        className={light ? "object-contain p-4 pb-16" : "object-contain p-3 pb-16"}
      />
      <div
        className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-4 pt-12 ${
          light
            ? "bg-gradient-to-t from-white via-white to-white/0"
            : "bg-gradient-to-t from-black via-black/75 to-transparent"
        }`}
      >
        <div className="min-w-0">
          <p className={`truncate text-[15px] font-semibold ${light ? "text-neutral-950" : "text-white"}`}>
            {project.title}
          </p>
          <p className={`mt-0.5 truncate text-xs ${light ? "text-neutral-500" : "text-white/70"}`}>
            {project.description}
          </p>
        </div>
        <span
          className={`grid size-8 shrink-0 place-items-center rounded-full transition group-hover:scale-105 ${
            light ? "bg-neutral-100 text-neutral-800" : "bg-white/15 text-white"
          }`}
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </a>
  );
}

export default async function Landing() {
  const testimonials = await listTestimonials();

  return (
    <div className="relative flex min-h-screen w-full flex-col px-6 pt-16 pb-24 sm:px-10 lg:h-full lg:min-h-0 lg:overflow-hidden lg:px-12 lg:pt-14 lg:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 right-[-6%] h-[380px] w-[460px] rounded-full bg-white/80 blur-3xl" />
        <div className="absolute top-[42%] -left-20 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute right-[-4%] bottom-10 h-72 w-[55%] rounded-[100%] bg-white/70 blur-2xl" />
      </div>

      <section className="relative grid min-h-0 flex-1 grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[minmax(0,1fr)_auto] lg:gap-x-10 lg:gap-y-0">
        <div className="flex min-h-0 w-full min-w-0 flex-col lg:col-start-1 lg:row-start-1 lg:h-full">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-10">
        <div className="relative shrink-0">
          <Image
            src="/profile.png"
            alt="Alfayad Shameer"
            width={1024}
            height={1536}
            priority
            className="size-28 rounded-full object-cover object-[center_30%] shadow-[0_24px_40px_-24px_rgba(0,0,0,0.55)] ring-[5px] ring-white lg:size-36"
          />
          <span className="absolute top-3 right-1 size-3.5 rounded-full bg-neutral-300 ring-[5px] ring-[#e6e6e6] lg:top-4" />
        </div>

        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-neutral-800">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 tracking-[0.04em]">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.16)]" />
              <span>MERN</span>
              <span className="text-neutral-300" aria-hidden>|</span>
              <span className="text-neutral-500">AI</span>
              <span className="text-neutral-300" aria-hidden>|</span>
              <span className="text-neutral-500">WEB</span>
              <span className="text-neutral-300" aria-hidden>|</span>
              <span className="text-neutral-500">Apps</span>
              <span className="text-neutral-300" aria-hidden>|</span>
              <span>Developer</span>
            </span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-4xl leading-[0.95] font-extrabold tracking-[-0.045em] text-neutral-950 sm:text-5xl lg:text-[3.4rem]">
              Hi, I’m Alfayad
            </h1>
            <nav aria-label="Social media" className="flex items-center gap-1">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 transition hover:bg-white hover:text-neutral-950"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </nav>
          </div>
          <HeroLine />

          <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="https://linkedin.com/in/alfayad"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Show More About Me
              <ArrowRight className="size-4" />
            </a>
            <a
              href="/resume/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-1 py-2.5 text-sm font-medium text-neutral-900 transition hover:text-neutral-600"
            >
              <Download className="size-4" />
              Download Resume
            </a>
            <span className="hidden h-11 w-px bg-neutral-300 lg:block" aria-hidden />
            <TechStack />
          </div>
        </div>
        </div>
        <p className="mt-6 flex flex-col items-start gap-2 text-sm leading-snug text-neutral-600 lg:mt-auto lg:mb-3 lg:h-8 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-2.5 lg:gap-y-0 lg:leading-none">
          <span className="inline-flex items-center gap-2 font-medium text-neutral-900">
            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.16)]" />
            Open for freelance
          </span>
          <span className="hidden text-neutral-300 lg:inline" aria-hidden>
            ·
          </span>
          <a href="mailto:alfayadshameer056@gmail.com" className="break-all transition hover:text-neutral-950 lg:break-normal">
            alfayadshameer056@gmail.com
          </a>
          <span className="hidden text-neutral-300 lg:inline" aria-hidden>
            ·
          </span>
          <a
            href="https://hirefayad.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 transition hover:decoration-neutral-950"
          >
            Hire me
          </a>
        </p>
        </div>
        <div className="min-h-0 w-full lg:col-start-2 lg:row-start-1 lg:w-[380px]">
          <CurrentCompany />
        </div>
        <SpotlightRow testimonials={testimonials} />
      </section>

      <section id="projects" className="relative mt-auto grid shrink-0 items-end gap-6 pt-6 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-6 lg:pt-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-700">
            <LayoutGrid className="size-3.5" />
            My Projects
          </span>
          <h2 className="mt-2 text-4xl leading-[0.95] font-extrabold tracking-[-0.045em] text-neutral-950 lg:text-[2rem]">
            Featured
            <br />
            Projects
          </h2>
          <p className="mt-1.5 max-w-xs text-sm leading-snug text-neutral-500 lg:max-w-[190px]">
            Some of my recent works built with passion.
          </p>
          <a
            href="#projects"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.4)] transition hover:bg-neutral-50"
          >
            Explore All Projects
            <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -top-4 -right-6 -bottom-4 -left-4 overflow-visible rounded-l-[36px] bg-white sm:-right-10 lg:-right-12"
          >
            <EdgeCut side="right" />
          </div>
          <div className="relative z-10 grid items-start gap-5 sm:w-max sm:grid-cols-3">
            <ProjectCard project={featured[0]} />
            <ProjectCard project={featured[1]} />
            <ProjectCard project={featured[2]} />
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 z-50 -translate-x-1/2">
        <div
          className="relative bg-white"
          style={{
            borderTopLeftRadius: CUT,
            borderTopRightRadius: CUT,
          }}
        >
          <BottomCuts />
          <div className="relative z-10 flex items-center px-3 py-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
