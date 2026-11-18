
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const videos = Array.from(
  { length: 18 },
  (_, i) => `/videos/wedding-${i + 1}.mp4`
);

export function Hero() {
  const videoOne = useRef<HTMLVideoElement>(null);
  const videoTwo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const first = videoOne.current;
    const second = videoTwo.current;

    if (!first || !second) return;

    let active = first;
    let standby = second;
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const switchVideo = () => {
      if (cancelled) return;

      index = (index + 1) % videos.length;

      standby.src = videos[index];
      standby.load();

      const showNext = () => {
        if (cancelled) return;

        standby.play().catch(() => {});
        standby.style.opacity = "1";
        active.style.opacity = "0";

        const previous = active;
        active = standby;
        standby = previous;

        standby.pause();

        timer = setTimeout(switchVideo, 3000);
      };

      if (standby.readyState >= 3) {
        showNext();
      } else {
        standby.addEventListener("canplay", showNext, { once: true });
      }
    };

    first.src = videos[0];
    first.load();
    first.play().catch(() => {});

    second.src = videos[1];
    second.load();

    timer = setTimeout(switchVideo, 3000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      first.pause();
      second.pause();
    };
  }, []);

  return (
    <section className="relative flex min-h-[650px] items-center overflow-hidden bg-[#49333F] md:min-h-[720px]">
      <video
        ref={videoOne}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 1 }}
      />

      <video
        ref={videoTwo}
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0 }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#F5B5CA]">
            Your Dream Wedding Starts Here
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Plan Your Dream Wedding with WedPlan
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/85 md:text-lg">
            Discover trusted vendors, book wedding services, and make
            your special day unforgettable.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex rounded-full bg-[#E88BAA] px-8 py-4 font-semibold text-[#49333F] hover:bg-[#F3B2C8]"
          >
            Explore Wedding Services →
          </Link>
        </div>
      </div>
    </section>
  );
}
