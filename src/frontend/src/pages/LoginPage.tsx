import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { useStore } from "../store";

const MEMBERS = ["Mr Doari", "Ms Samanta", "Mr Sarkar", "Mr Dey", "Anonymous"];

export function LoginPage() {
  const { dispatch } = useStore();
  const [selected, setSelected] = useState<string | null>(null);

  function enter() {
    if (!selected) return;
    dispatch({ type: "SET_USER", payload: { name: selected } });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-end p-4">
        <ThemeSwitcher />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary mb-4">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl text-foreground mb-1">
              Study Hub
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Private study space for five — pick your name to enter.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">
              Who are you?
            </p>
            <div className="grid grid-cols-1 gap-2" data-ocid="login.select">
              {MEMBERS.map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setSelected(name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-150",
                    selected === name
                      ? "border-primary bg-primary/8 text-primary shadow-xs"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      selected === name
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {name.split(" ").pop()![0]}
                  </div>
                  {name}
                  {selected === name && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!selected}
            onClick={enter}
            data-ocid="login.submit_button"
          >
            Enter Hub
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
