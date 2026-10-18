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
};
