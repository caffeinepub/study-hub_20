import type { Theme } from "./store";

export interface ThemeOption {
  id: Theme;
  label: string;
  description: string;
  previewColors: string[];
}

export const THEMES: ThemeOption[] = [
  {
    id: "light",
    label: "Light",
    description: "Clean white with forest green accents",
    previewColors: ["#f9fafb", "#f3f4f6", "#1a3a2a"],
  },
  {
    id: "dark",
    label: "Dark",
    description: "Deep slate with soft green accents",
    previewColors: ["#1c1f2e", "#252838", "#6ac49c"],
  },
  {
    id: "warm",
    label: "Warm",
    description: "Soft amber and cream tones",
    previewColors: ["#faf7f0", "#f5eed8", "#7a5c2a"],
  },
  {
    id: "cool",
    label: "Cool",
    description: "Soft blue-gray with indigo accents",
    previewColors: ["#f0f3f8", "#e6ecf5", "#2a3a8a"],
  },
  {
    id: "contrast",
    label: "High Contrast",
    description: "Pure black with vivid yellow",
    previewColors: ["#0d0d0d", "#1a1a1a", "#e6c015"],
  },
];
