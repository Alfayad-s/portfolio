"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  AWS,
  Angular,
  Bootstrap5,
  CSS3,
  Docker,
  Figma,
  Flutter,
  Git,
  GitHubDark,
  GitLab,
  GoogleCloud,
  HTML5,
  JavaScript,
  Kotlin,
  Kubernetes,
  Linux,
  MongoDB,
  MySQL,
  NPMWordmark,
  NestJS,
  NextJsWordmark,
  NodeJs,
  PostgreSQL,
  Python,
  React as ReactLogo,
  Redis,
  Redux,
  Slack,
  SvelteJS,
  Swift,
  TypeScript,
  Ubuntu,
  VisualStudioCode,
} from "developer-icons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SiDebian, SiXcode } from "react-icons/si";

const stacks = [
  { name: "React", description: "Component library for building user interfaces.", Icon: ReactLogo },
  { name: "Next.js", description: "React framework for pages, routing, and rendering.", Icon: NextJsWordmark, viewBox: "0 40 100 20.4", width: 96, height: 20 },
  { name: "JavaScript", description: "Language behind interactive web apps.", Icon: JavaScript },
  { name: "TypeScript", description: "JavaScript with types for safer code.", Icon: TypeScript },
  { name: "Node.js", description: "JavaScript runtime for servers and tools.", Icon: NodeJs },
  { name: "NestJS", description: "Structured Node framework for backend APIs.", Icon: NestJS },
  { name: "Redux", description: "Predictable store for shared app state.", Icon: Redux },
  { name: "HTML", description: "Markup that structures a page.", Icon: HTML5 },
  { name: "CSS", description: "Styles layout, color, and motion.", Icon: CSS3 },
  { name: "Bootstrap", description: "Ready-made grid and UI components.", Icon: Bootstrap5 },
  { name: "Svelte", description: "Compiler that ships lean interface code.", Icon: SvelteJS },
  { name: "Angular", description: "Framework for large web applications.", Icon: Angular },
  { name: "MongoDB", description: "Document database for flexible data.", Icon: MongoDB },
  { name: "MySQL", description: "Relational database for structured data.", Icon: MySQL },
  { name: "PostgreSQL", description: "Advanced relational database.", Icon: PostgreSQL },
  { name: "Redis", description: "In-memory store for cache and speed.", Icon: Redis },
  { name: "Python", description: "Language for scripting and backend work.", Icon: Python },
  { name: "Flutter", description: "Toolkit for native-feeling mobile apps.", Icon: Flutter },
  { name: "Swift", description: "Language for iPhone and Mac apps.", Icon: Swift },
  { name: "Kotlin", description: "Modern language for Android development.", Icon: Kotlin },
  { name: "Docker", description: "Packages an app and its dependencies.", Icon: Docker },
  { name: "Kubernetes", description: "Runs and scales containers.", Icon: Kubernetes },
  { name: "AWS", description: "Cloud platform for hosting and services.", Icon: AWS },
  { name: "Google Cloud", description: "Cloud platform for apps and data.", Icon: GoogleCloud },
  { name: "Git", description: "Tracks changes in source code.", Icon: Git },
  { name: "GitHub", description: "Hosts Git repositories and reviews.", Icon: GitHubDark },
  { name: "GitLab", description: "Git hosting with built-in delivery.", Icon: GitLab },
  { name: "Linux", description: "Open-source operating system.", Icon: Linux },
  { name: "Ubuntu", description: "Widely used Linux distribution.", Icon: Ubuntu },
  { name: "Debian", description: "Stable Linux distribution.", Icon: SiDebian, color: "#A80030" },
  { name: "VS Code", description: "Editor for everyday development.", Icon: VisualStudioCode },
  { name: "Xcode", description: "Apple's tools for iOS and macOS.", Icon: SiXcode, color: "#147EFB" },
  { name: "Figma", description: "Design tool for interfaces.", Icon: Figma },
  { name: "npm", description: "Package manager for JavaScript.", Icon: NPMWordmark, viewBox: "0 28.9 100 41.2", width: 54, height: 22 },
  { name: "Slack", description: "Team chat for project work.", Icon: Slack },
  { name: "Cloud", description: "Hosting and deployment infrastructure.", file: "cloud" },
];

export default function TechStack() {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tip, setTip] = useState(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!api || paused) return;

    const timer = window.setTimeout(() => {
      if (pausedRef.current) return;
      api.scrollNext();
      setCurrent((value) => value + 1);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [api, current, paused]);

  useEffect(() => {
    if (!api) return;
    const node = api.rootNode();

    const onWheel = (event) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      pausedRef.current = true;
      setPaused(true);
      const engine = api.internalEngine();
      engine.scrollBody.useDuration(16);
      engine.scrollTo.distance(delta, false);
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [api]);

  const pause = () => {
    pausedRef.current = true;
    setPaused(true);
  };

  const resume = () => {
    pausedRef.current = false;
    setPaused(false);
    setTip(null);
  };

  const showTip = (name, description, element) => {
    const rect = element.getBoundingClientRect();
    const width = 220;
    const x = Math.min(
      window.innerWidth - width / 2 - 16,
      Math.max(width / 2 + 16, rect.left + rect.width / 2),
    );
    setTip({
      name,
      description,
      x,
      y: rect.bottom + 10,
    });
  };

  return (
    <div
      className="relative mt-1 w-full min-w-0 cursor-grab touch-pan-y select-none self-center active:cursor-grabbing lg:mt-0 lg:w-[420px]"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onPointerDown={() => setTip(null)}
    >
      <p
        className="pointer-events-none mb-1 flex items-end gap-1 text-neutral-400 lg:absolute lg:-top-10 lg:left-1 lg:mb-0"
        style={{ fontFamily: '"Segoe Script", "Bradley Hand", "Comic Sans MS", cursive' }}
      >
        <span className="text-[15px] leading-none">I know these</span>
        <svg
          aria-hidden
          viewBox="0 0 64 36"
          className="mb-1 h-7 w-12 text-neutral-400"
          fill="none"
        >
          <path
            d="M4 8c12 1 22-5 34-3 9 1 16 7 12 13-3 5-12 6-16 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M32 20c2 6 1 10-3 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M25 30l4 6 7-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, dragFree: true, duration: 28 }}
      >
        <CarouselContent className="-ml-4 items-center">
          {stacks.map(({ name, description, Icon, viewBox, color, file, width, height }) => (
            <CarouselItem className="basis-auto pl-4" key={name}>
              <button
                type="button"
                className="flex cursor-grab items-center justify-center rounded-2xl py-1 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 active:cursor-grabbing"
                aria-label={name}
                onMouseEnter={(event) =>
                  showTip(name, description, event.currentTarget)
                }
                onFocus={(event) =>
                  showTip(name, description, event.currentTarget)
                }
                onMouseLeave={() => setTip(null)}
                onBlur={() => setTip(null)}
              >
                {file ? (
                  <Image
                    src={`/languages/${file}.png`}
                    alt=""
                    width={160}
                    height={160}
                    draggable={false}
                    className="pointer-events-none size-9 object-contain"
                  />
                ) : (
                  <Icon
                    size={width || 36}
                    color={color}
                    {...(viewBox ? { viewBox } : {})}
                    className="pointer-events-none"
                    style={{ width: width || 36, height: height || 36 }}
                  />
                )}
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {tip ? (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[60] w-[220px] -translate-x-1/2 rounded-2xl bg-neutral-950 px-3.5 py-2.5 text-left"
          style={{ left: tip.x, top: tip.y }}
        >
          <p className="text-sm font-semibold leading-none text-white">
            {tip.name}
          </p>
          <p className="mt-1.5 text-xs leading-snug text-white/65">
            {tip.description}
          </p>
        </div>
      ) : null}
    </div>
  );
}
