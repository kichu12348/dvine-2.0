"use client";

import PatternWaves from "./PatternWaves";
import styles from "./HeroBackground.module.css";

type BackgroundProps = {
  active: boolean;
  reducedMotion: boolean;
};

export default function HeroBackground({ active, reducedMotion }: BackgroundProps) {
  return (
    <div className={styles.background} aria-hidden="true">
      <PatternWaves
        preset="silk"
        pattern="dot"
        color="#1abaff"
        backgroundColor="transparent"
        spacing={8}
        markSize={0.65}
        depth={0.9}
        shine={1.1}
        contrast={1.45}
        opacity={0.62}
        speed={0.4}
        scale={0.95}
        direction={32}
        fade="edges"
        fadeSize={0.25}
        cursorSize={80}
        cursorStrength={0.7}
        interactive={active && !reducedMotion}
        paused={!active || reducedMotion}
        intro={false}
      />
      <div className={styles.shade} />
    </div>
  );
}
