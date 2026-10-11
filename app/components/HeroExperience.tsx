"use client";

import { useCallback, useState } from "react";
import Hero from "./Hero";
import LoadingScreen from "./LoadingScreen";

export default function HeroExperience() {
  const [ready, setReady] = useState(false);
  const handleIntroComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <LoadingScreen onReveal={handleIntroComplete} onComplete={handleIntroComplete} />
      <Hero ready={ready} />
    </>
  );
}
