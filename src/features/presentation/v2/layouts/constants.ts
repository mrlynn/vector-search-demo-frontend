// src/features/presentation/v2/layouts/constants.ts
export const LAYOUT_STYLES = {
    heading: {
      subtitle: "text-[#00ED64] text-xl uppercase tracking-wider",
      title: "text-5xl font-bold text-white",
    },
    containers: {
      fullscreen: "h-screen w-screen",
      maxWidth: "max-w-7xl",
      content: "max-w-4xl",
    },
    spacing: {
      standard: "mb-8",
      tight: "mb-4",
      loose: "mb-12",
    }
  } as const;