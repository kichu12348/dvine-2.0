declare module '@hugeicons/core-free-icons' {
  export const ArrowRight02Icon: any;
  export const Tick02Icon: any;
  const icons: Record<string, any>;
  export default icons;
}

declare module '@hugeicons/react' {
  import React from 'react';
  export interface HugeiconsIconProps {
    icon: any;
    size?: number;
    strokeWidth?: number;
    className?: string;
    color?: string;
  }
  export const HugeiconsIcon: React.FC<HugeiconsIconProps>;
}
