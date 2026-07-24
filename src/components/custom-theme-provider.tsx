"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

export function CustomThemeProvider() {
  const pengaturan = useStore((s) => s.pengaturan);
  const tema = pengaturan?.tema;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !tema || tema.tipe === "default") return null;

  const getBackgroundRule = () => {
    if (tema.tipe === "solid") return `background: ${tema.warnaSolid} !important;`;
    if (tema.tipe === "gradient") return `background: ${tema.warnaGradient} !important;`;
    if (tema.tipe === "wallpaper" && tema.wallpaperUrl) {
      return `
        background-image: url(${tema.wallpaperUrl}) !important;
        background-size: cover !important;
        background-position: center !important;
        background-attachment: fixed !important;
      `;
    }
    return "";
  };

  const getGlassRule = () => {
    if (tema.tipe === "wallpaper") {
      // 100% opacity means solid, 10% opacity means almost transparent
      // We convert 0.1-1.0 to percentage
      const opacityStr = (tema.glassOpacity * 100).toFixed(0) + "%";
      return `
        .bg-card, .bg-popover, .card-fancy, .glass, [data-sidebar="sidebar"] {
          background-color: color-mix(in srgb, var(--card) ${opacityStr}, transparent) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
        }
        /* Make subtle inputs a bit more visible over glass */
        .bg-muted {
          background-color: color-mix(in srgb, var(--muted) 60%, transparent) !important;
        }
      `;
    }
    return "";
  };

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      body {
        ${getBackgroundRule()}
      }
      ${getGlassRule()}
    `}} />
  );
}
