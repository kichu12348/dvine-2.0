export const motionTransitions = {
  springSnappy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 30,
    mass: 0.8,
  },
  springGentle: {
    type: "spring" as const,
    stiffness: 260,
    damping: 28,
    mass: 1,
  },
  springBouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 20,
    mass: 0.6,
  },
  easeOut: {
    duration: 0.35,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
};
