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

function DockShape() {
  const cut = 28;
  const top = 28;
  const bodyW = 64;
  const bodyH = top + cut;
  const width = bodyW + cut * 2;
  const side = bodyH - cut;

  const d = [
    `M 0 ${bodyH}`,
    `H ${width}`,
    `A ${cut} ${cut} 0 0 1 ${width - cut} ${side}`,
    `A ${top} ${top} 0 0 0 ${width - cut - top} 0`,
    `H ${cut + top}`,
    `A ${top} ${top} 0 0 0 ${cut} ${side}`,
    `A ${cut} ${cut} 0 0 1 0 ${bodyH}`,
    "Z",
  ].join(" ");

  return (
    <svg
      aria-hidden
      width={width}
      height={bodyH}
      viewBox={`0 0 ${width} ${bodyH}`}
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
    >
      <path d={d} fill="#fff" />
    </svg>
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
      className={`project-card group relative block h-[156px] w-full overflow-hidden rounded-[24px] transition duration-300 hover:-translate-y-1 sm:w-[210px] lg:h-[200px] lg:w-full xl:h-[240px] xl:rounded-[28px] 2xl:h-[280px] 2xl:rounded-[32px] ${
        light ? "bg-white ring-1 ring-black/5" : "bg-neutral-950"
      } ${className}`}
    >
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(min-width: 1536px) 480px, (min-width: 1024px) 360px, 100vw"
        className={
          light
            ? "object-contain p-4 pb-16 xl:p-6 xl:pb-22 2xl:p-8 2xl:pb-24"
            : "object-contain p-3 pb-16 xl:p-5 xl:pb-22 2xl:p-7 2xl:pb-24"
        }
      />
      <div
        className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-4 pt-12 xl:gap-4 xl:px-5 xl:pb-5 2xl:px-6 2xl:pb-6 ${
          light
            ? "bg-gradient-to-t from-white via-white to-white/0"
            : "bg-gradient-to-t from-black via-black/75 to-transparent"
        }`}
      >
        <div className="min-w-0">
          <p className={`card-title truncate text-[15px] font-semibold xl:text-lg 2xl:text-2xl ${light ? "text-neutral-950" : "text-white"}`}>
            {project.title}
          </p>
          <p className={`card-body mt-0.5 truncate text-xs xl:mt-1 xl:text-sm 2xl:text-base ${light ? "text-neutral-500" : "text-white/70"}`}>
            {project.description}
          </p>
        </div>
        <span
          className={`card-action grid size-8 shrink-0 place-items-center rounded-full transition group-hover:scale-105 xl:size-10 2xl:size-12 ${
            light ? "bg-neutral-100 text-neutral-800" : "bg-white/15 text-white"
          }`}
        >
          <ArrowUpRight className="size-4 xl:size-5 2xl:size-6" />
        </span>
      </div>
    </a>
  );
}

export default async function Landing() {
  const testimonials = await listTestimonials();

  return (
    <div className="home-layout relative flex min-h-screen w-full flex-col gap-8 px-6 pt-16 pb-24 sm:px-10 lg:grid lg:gap-5 lg:px-12 lg:pt-14 lg:pb-24 xl:gap-6 xl:px-16 2xl:px-20 2xl:gap-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 right-[-6%] h-[380px] w-[460px] rounded-full bg-white/80 blur-3xl" />
        <div className="absolute top-[42%] -left-20 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute right-[-4%] bottom-10 h-72 w-[55%] rounded-[100%] bg-white/70 blur-2xl" />
      </div>

      <section className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_480px] xl:gap-x-14 2xl:grid-cols-[minmax(0,1fr)_560px] 2xl:gap-x-16">
        <div className="flex min-h-0 w-full min-w-0 flex-col lg:col-start-1 lg:row-start-1">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
        <div className="relative shrink-0">
          <Image
            src="/profile.png"
            alt="Alfayad Shameer"
            width={1024}
            height={1536}
            priority
            className="size-28 rounded-full object-cover object-[center_30%] shadow-[0_24px_40px_-24px_rgba(0,0,0,0.55)] ring-[5px] ring-white lg:size-36 xl:size-44 2xl:size-52"
          />
          <span className="absolute top-3 right-1 size-3.5 rounded-full bg-neutral-300 ring-[5px] ring-[#e6e6e6] lg:top-4 xl:size-4" />
        </div>

        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-neutral-800 xl:text-base">
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
            <h1 className="text-4xl leading-[0.95] font-extrabold tracking-[-0.045em] text-neutral-950 sm:text-5xl lg:text-[3.4rem] xl:text-[4.25rem] 2xl:text-[5rem]">
              Hi, I’m Alfayad
            </h1>
            <nav aria-label="Social media" className="flex items-center gap-1 xl:gap-1.5">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 transition hover:bg-white hover:text-neutral-950 xl:size-10"
                >
                  <Icon className="size-4 xl:size-5" aria-hidden />
                </a>
              ))}
            </nav>
          </div>
          <HeroLine />

          <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 xl:mt-6">
            <a
              href="https://linkedin.com/in/alfayad"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 xl:px-6 xl:py-3 xl:text-base"
            >
              Show More About Me
              <ArrowRight className="size-4 xl:size-5" />
            </a>
            <a
              href="/resume/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-1 py-2.5 text-sm font-medium text-neutral-900 transition hover:text-neutral-600 xl:text-base"
            >
              <Download className="size-4 xl:size-5" />
              Download Resume
            </a>
            <span className="hidden h-11 w-px bg-neutral-300 lg:block xl:h-12" aria-hidden />
            <TechStack />
          </div>
        </div>
        </div>
        <p className="mt-6 flex flex-col items-start gap-2 text-sm leading-snug text-neutral-600 lg:mt-8 lg:h-auto lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-2.5 lg:gap-y-0 lg:leading-none xl:text-base">
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
        <div className="min-h-0 w-full lg:col-start-2 lg:row-start-1 lg:w-[380px] xl:w-[480px] 2xl:w-[560px]">
          <CurrentCompany />
        </div>
      </section>

      <SpotlightRow testimonials={testimonials} />

      <section id="projects" className="relative grid items-end gap-6 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-stretch lg:gap-6 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-8 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:flex lg:flex-col lg:justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-700 xl:text-sm 2xl:px-3.5 2xl:py-1.5 2xl:text-base">
            <LayoutGrid className="size-3.5 xl:size-4 2xl:size-5" />
            My Projects
          </span>
          <h2 className="card-title mt-2 text-4xl leading-[0.95] font-extrabold tracking-[-0.045em] text-neutral-950 lg:text-[2rem] xl:text-[2.75rem] 2xl:text-[3.25rem]">
            Featured
            <br />
            Projects
          </h2>
          <p className="card-body mt-1.5 max-w-xs text-sm leading-snug text-neutral-500 lg:max-w-[190px] xl:mt-2 xl:max-w-[240px] xl:text-base 2xl:max-w-[280px] 2xl:text-lg">
            Some of my recent works built with passion.
          </p>
          <a
            href="#projects"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.4)] transition hover:bg-neutral-50 xl:mt-3 xl:px-5 xl:py-2.5 xl:text-base 2xl:mt-4 2xl:px-6 2xl:py-3 2xl:text-lg"
          >
            Explore All Projects
            <ArrowRight className="size-4 xl:size-5 2xl:size-6" />
          </a>
        </div>

        <div className="projects-cut relative -mr-6 rounded-l-[36px] bg-white py-4 pr-4 pl-4 sm:-mr-10 sm:pr-6 lg:-mr-12 lg:rounded-l-[40px] lg:py-5 lg:pr-8 lg:pl-5 xl:-mr-16 2xl:-mr-20">
          <EdgeCut side="right" />
          <div className="projects-cut-grid relative z-10 grid items-stretch gap-5 sm:w-max sm:grid-cols-3 lg:h-full lg:w-full lg:gap-4">
            <ProjectCard project={featured[0]} />
            <ProjectCard project={featured[1]} />
            <ProjectCard project={featured[2]} />
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 z-50 -translate-x-1/2">
        <div className="relative h-14 w-[120px]">
          <DockShape />
          <div className="absolute inset-0 flex items-center justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
