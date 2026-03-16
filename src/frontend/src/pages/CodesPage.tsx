import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { uid, useStore } from "../store";
import type { CodeSnippet } from "../store";

const LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "SQL",
  "Bash",
  "Other",
];

const LANG_COLORS: Record<string, string> = {
  Python: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  JavaScript:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  TypeScript: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  Java: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "C++":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  SQL: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Bash: "bg-muted text-muted-foreground",
  Other: "bg-muted text-muted-foreground",
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    import("highlight.js").then((hljs) => {
      if (cancelled || !ref.current) return;
      const langMap: Record<string, string> = {
        Python: "python",
        JavaScript: "javascript",
        TypeScript: "typescript",
        Java: "java",
        "C++": "cpp",
        SQL: "sql",
        Bash: "bash",
      };
      const lang = langMap[language];
      if (lang) {
        try {
          const result = hljs.default.highlight(code, { language: lang });
          if (ref.current) ref.current.innerHTML = result.value;
        } catch {
          if (ref.current) ref.current.textContent = code;
        }
      } else {
        if (ref.current) ref.current.textContent = code;
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  return (
    <div className="code-block mt-3">
      <pre>
        <code ref={ref} className={`language-${language.toLowerCase()} hljs`}>
          {code}
        </code>
      </pre>
    </div>
  );
}

export function CodesPage() {
  const { state, dispatch } = useStore();
  const [langFilter, setLangFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    title: "",
    language: "Python",
    topic: "",
    code: "",
  });

  const langs = [
    "All",
    ...Array.from(new Set(state.snippets.map((s) => s.language))),
  ];
  const filtered = state.snippets.filter((s) => {
    if (langFilter !== "All" && s.language !== langFilter) return false;
    if (
      topicFilter &&
      !s.topic.toLowerCase().includes(topicFilter.toLowerCase())
    )
      return false;
    return true;
  });

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    if (!form.title || !form.code || !state.user) return;
    const snippet: CodeSnippet = {
      id: uid(),
      title: form.title,
      language: form.language,
      topic: form.topic || "General",
      code: form.code,
      addedBy: state.user.name,
      timestamp: Date.now(),
    };
    dispatch({ type: "ADD_SNIPPET", payload: snippet });
    toast.success("Snippet added");
    setAddOpen(false);
    setForm({ title: "", language: "Python", topic: "", code: "" });
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => toast.success("Copied!"));
  }

  function confirmDelete(id: string) {
    dispatch({ type: "DELETE_SNIPPET", payload: id });
    toast.success("Snippet removed");
    setDeleteTarget(null);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-foreground">
            Code Snippets
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {state.snippets.length} snippets shared
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-ocid="codes.add_button">
          <Plus className="h-4 w-4 mr-2" />
          Add Snippet
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-1.5 flex-wrap">
          {langs.map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => setLangFilter(l)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                langFilter === l
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <Input
          placeholder="Search by topic..."
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="sm:max-w-48 h-7 text-xs"
          data-ocid="codes.search_input"
        />
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="codes.empty_state"
        >
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
            <Code2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No snippets yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add a code snippet to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((snippet, i) => (
            <div
              key={snippet.id}
              data-ocid={`codes.item.${i + 1}`}
              className="rounded-xl border border-border bg-card shadow-xs overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      {snippet.title}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded font-medium",
                        LANG_COLORS[snippet.language] ?? LANG_COLORS.Other,
                      )}
                    >
                      {snippet.language}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                      {snippet.topic}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    by {snippet.addedBy}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => copyCode(snippet.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTarget(snippet.id)}
                    data-ocid={`codes.delete_button.${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => toggleExpand(snippet.id)}
                  >
                    {expanded.has(snippet.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {expanded.has(snippet.id) && (
                <div className="px-4 pb-4">
                  <CodeBlock code={snippet.code} language={snippet.language} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl" data-ocid="codes.dialog">
          <DialogHeader>
            <DialogTitle className="font-display font-normal">
              Add Code Snippet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. Binary Search"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  data-ocid="codes.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Topic</Label>
                <Input
                  placeholder="e.g. Algorithms"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  data-ocid="codes.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Select
                value={form.language}
                onValueChange={(v) => setForm({ ...form, language: v })}
              >
                <SelectTrigger data-ocid="codes.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Textarea
                placeholder="Paste your code here..."
                rows={10}
                className="font-mono text-xs"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                data-ocid="codes.editor"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="codes.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.title || !form.code}
              data-ocid="codes.confirm_button"
            >
              Add Snippet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="codes.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this snippet?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="codes.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && confirmDelete(deleteTarget)}
              data-ocid="codes.confirm_button"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
