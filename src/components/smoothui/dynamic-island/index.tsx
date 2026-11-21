"use client";

import { cn } from "@/lib/utils";
import {
  BatteryCharging,
  BatteryFull,
  Clock,
  MusicNotes,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const BOUNCE_VARIANTS = {
  idle: 0.5,
  "idle-ring": 0.5,
  "idle-timer": 0.3,
  "ring-idle": 0.5,
  "ring-timer": 0.35,
  "timer-idle": 0.3,
  "timer-ring": 0.35,
} as const;

const ICON = { size: 18, weight: "bold" as const };
const DEFAULT_BOUNCE = 0.5;
const TIMER_INTERVAL_MS = 1000;
const CUT = 20;

function fillet(origin: string) {
  return `radial-gradient(circle at ${origin}, transparent ${CUT}px, #fff ${CUT + 0.5}px)`;
}

function SmoothCuts() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute top-0"
        style={{
          left: -CUT,
          width: CUT + 1,
          height: CUT + 1,
          background: fillet("0 100%"),
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0"
        style={{
          right: -CUT,
          width: CUT + 1,
          height: CUT + 1,
          background: fillet("100% 100%"),
        }}
      />
    </>
  );
}

type BatteryManager = {
  charging: boolean;
  level: number;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
};

function useCurrentTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TIMER_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${hour12}:${minutes} ${period}`;
}

function useBatteryCharge() {
  const [charge, setCharge] = useState<{
    charging: boolean;
    level: number | null;
  }>({ charging: false, level: null });

  useEffect(() => {
    const batteryNavigator = navigator as Navigator & {
      getBattery?: () => Promise<BatteryManager>;
    };
    if (!batteryNavigator.getBattery) return;

    let battery: BatteryManager | null = null;
    let active = true;
    const sync = () => {
      if (!battery || !active) return;
      setCharge({
        charging: battery.charging,
        level: Math.round(battery.level * 100),
      });
    };

    batteryNavigator.getBattery().then((next) => {
      battery = next;
      sync();
      next.addEventListener("levelchange", sync);
      next.addEventListener("chargingchange", sync);
    });

    return () => {
      active = false;
      battery?.removeEventListener("levelchange", sync);
      battery?.removeEventListener("chargingchange", sync);
    };
  }, []);

  return charge;
}

type NowPlaying = {
  artist: string;
  title: string;
};

function useNowPlaying() {
  const [track, setTrack] = useState<NowPlaying | null>(null);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const read = () => {
      const meta = navigator.mediaSession.metadata;
      const state = navigator.mediaSession.playbackState;
      if (!meta || state === "none" || state === "paused") {
        setTrack(null);
        return;
      }
      setTrack({
        artist: meta.artist || "",
        title: meta.title || "Now playing",
      });
    };

    read();
    const timer = setInterval(read, TIMER_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return track;
}

const TimeView = () => {
  const time = useCurrentTime();

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 text-neutral-900">
      <Clock {...ICON} className="text-neutral-900" />
      <span className="pointer-events-none font-medium text-sm leading-none tabular-nums">
        {time}
      </span>
    </div>
  );
};

const ChargeView = ({
  charging,
  level,
}: {
  charging: boolean;
  level: number | null;
}) => {
  const BatteryIcon = charging ? BatteryCharging : BatteryFull;

  return (
    <div className="flex flex-col items-center px-4 pt-2 pb-1.5 text-neutral-900">
      <span className="flex items-center justify-center gap-2">
        <BatteryIcon
          {...ICON}
          className={charging ? "text-green-600" : "text-neutral-900"}
        />
        <span className="pointer-events-none font-medium text-sm leading-none tabular-nums">
          {level == null ? "—" : `${level}%`}
        </span>
      </span>
      <span className="pointer-events-none mt-1 text-[11px] leading-none opacity-60">
        {level == null ? "" : charging ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
};

const MusicView = ({ artist, title }: NowPlaying) => (
  <div className="flex max-w-64 flex-col items-center px-4 pt-2 pb-1.5 text-neutral-900">
    <span className="flex max-w-full items-center justify-center gap-2">
      <MusicNotes {...ICON} className="shrink-0 text-pink-500" />
      <span className="pointer-events-none truncate font-medium text-sm leading-none">
        {title}
      </span>
    </span>
    {artist ? (
      <span className="pointer-events-none mt-1 max-w-full truncate text-[11px] leading-none opacity-60">
        {artist}
      </span>
    ) : null}
  </div>
);

type View = "time" | "charge" | "music";

export default function DynamicIsland({
  className = "",
}: {
  className?: string;
}) {
  const [variantKey, setVariantKey] = useState("time");
  const [chargeNotice, setChargeNotice] = useState(false);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<View>("time");
  const shouldReduceMotion = useReducedMotion();
  const charge = useBatteryCharge();
  const music = useNowPlaying();
  const previousCharging = useRef<boolean | null>(null);
  const previousView = useRef<View>("time");
  const hideTimer = useRef<number | null>(null);
  const holdTimer = useRef<number | null>(null);
  const heldRef = useRef<View | null>(null);
  const autoViewRef = useRef<View>("time");
  const contentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [restWidth, setRestWidth] = useState(136);
  const [tabsHeight, setTabsHeight] = useState(48);
  const [held, setHeld] = useState<View | null>(null);

  const autoView: View = chargeNotice ? "charge" : music ? "music" : "time";
  autoViewRef.current = autoView;
  const view: View = held ?? (open ? picked : autoView);

  const selectTab = (id: View) => {
    setPicked(id);
    if (holdTimer.current) window.clearTimeout(holdTimer.current);

    if (id === "time") {
      heldRef.current = null;
      holdTimer.current = null;
      setHeld(null);
      setOpen(false);
      return;
    }

    heldRef.current = id;
    setHeld(id);
    setOpen(false);
    holdTimer.current = window.setTimeout(() => {
      heldRef.current = null;
      holdTimer.current = null;
      setHeld(null);
      setPicked("time");
      setOpen(false);
    }, 5000);
  };

  useEffect(() => {
    if (previousView.current === view) return;
    setVariantKey(`${previousView.current}-${view}`);
    previousView.current = view;
  }, [view]);

  useLayoutEffect(() => {
    if (open) return;
    const node = contentRef.current;
    if (!node) return;
    const next = node.offsetWidth;
    setRestWidth((prev) => (Math.abs(prev - next) > 1 ? next : prev));
  }, [open, view, charge.level, music]);

  useLayoutEffect(() => {
    const node = tabsRef.current;
    if (!node) return;
    const next = node.offsetHeight;
    if (next > 0) setTabsHeight((prev) => (prev === next ? prev : next));
  }, [open]);

  useEffect(() => {
    return () => {
      if (holdTimer.current) window.clearTimeout(holdTimer.current);
    };
  }, []);

  useEffect(() => {
    if (charge.level == null) return;
    if (previousCharging.current === null) {
      previousCharging.current = charge.charging;
      return;
    }
    if (previousCharging.current === charge.charging) return;

    previousCharging.current = charge.charging;
    setChargeNotice(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      setChargeNotice(false);
    }, 4000);
  }, [charge.charging, charge.level]);

  const content = useMemo(() => {
    if (view === "charge") {
      return <ChargeView charging={charge.charging} level={charge.level} />;
    }
    if (view === "music") {
      return music ? (
        <MusicView artist={music.artist} title={music.title} />
      ) : (
        <MusicView artist="" title="Not playing" />
      );
    }
    return <TimeView />;
  }, [view, charge.charging, charge.level, music]);

  const tabs: { id: View; label: string; icon: typeof Clock }[] = [
    { id: "time", label: "Time", icon: Clock },
    { id: "charge", label: "Battery", icon: BatteryCharging },
    { id: "music", label: "Music", icon: MusicNotes },
  ];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative flex w-full flex-col items-center">
        <div
          className="relative mx-auto bg-white"
          onMouseEnter={() => {
            if (heldRef.current) return;
            setPicked(autoViewRef.current);
            setOpen(true);
          }}
          onMouseLeave={() => {
            if (heldRef.current) return;
            setOpen(false);
          }}
          style={{
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            overflow: "visible",
            width: open ? 320 : restWidth,
            transition: shouldReduceMotion
              ? undefined
              : "width 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <SmoothCuts />
          <div className="relative z-10 flex w-full flex-col items-center">
          <motion.div
            className={cn("relative w-max min-w-[136px]", open && "pt-1")}
            ref={contentRef}
            style={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : {
                    filter: "blur(0px)",
                    opacity: 1,
                    originX: 0.5,
                    originY: 0.5,
                    scale: 1,
                    transition: { delay: 0.05 },
                  }
            }
            initial={{
              filter: "blur(5px)",
              opacity: 0,
              originX: 0.5,
              originY: 0.5,
              scale: 0.9,
            }}
            key={view}
            transition={{
              bounce:
                BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ??
                DEFAULT_BOUNCE,
              type: "spring" as const,
            }}
          >
            {content}
          </motion.div>
          <div
            aria-hidden={!open}
            className="w-full overflow-hidden"
            inert={!open}
            style={{
              height: open ? tabsHeight : 0,
              opacity: open ? 1 : 0,
              transition: shouldReduceMotion
                ? undefined
                : "height 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease",
            }}
          >
            <div
              className="flex items-center justify-center gap-1 px-3 pt-1 pb-3"
              ref={tabsRef}
            >
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const active = picked === tab.id;
                return (
                  <button
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                      active
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-500 hover:bg-neutral-100",
                    )}
                    key={tab.id}
                    onClick={() => selectTab(tab.id)}
                    type="button"
                  >
                    <TabIcon size={14} weight="bold" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
