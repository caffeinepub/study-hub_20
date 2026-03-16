import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette } from "lucide-react";
import { useStore } from "../store";
import type { Theme } from "../store";
import { THEMES } from "../themes";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { state, dispatch } = useStore();

  const current = THEMES.find((t) => t.id === state.theme) ?? THEMES[0];

  function setTheme(theme: Theme) {
    dispatch({ type: "SET_THEME", payload: theme });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className="gap-2 text-muted-foreground hover:text-foreground"
          data-ocid="theme.select"
        >
          <Palette className="h-4 w-4" />
          {!compact && (
            <span className="text-xs font-medium">{current.label}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="gap-3 cursor-pointer"
          >
            <div className="flex gap-1">
              {t.previewColors.map((c) => (
                <span
                  key={c}
                  className="h-3.5 w-3.5 rounded-full border border-border/40"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{t.label}</span>
                {state.theme === t.id && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
