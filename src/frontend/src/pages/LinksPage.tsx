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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ExternalLink, Link2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uid, useStore } from "../store";
import type { StudyLink } from "../store";

const LABEL_COLORS: Record<string, string> = {
  General: "bg-muted text-muted-foreground",
  Math: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  CS: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Physics:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  English: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

function getLabelColor(label: string) {
  return LABEL_COLORS[label] ?? "bg-muted text-muted-foreground";
}

export function LinksPage() {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    label: "",
  });

  const labels = [
    "All",
    ...Array.from(new Set(state.links.map((l) => l.label))),
  ];
  const filtered = state.links.filter(
    (l) => filter === "All" || l.label === filter,
  );

  function handleAdd() {
    if (!form.title || !form.url || !state.user) return;
    const link: StudyLink = {
      id: uid(),
      title: form.title,
      url: form.url.startsWith("http") ? form.url : `https://${form.url}`,
      description: form.description,
      label: form.label || "General",
      addedBy: state.user.name,
      timestamp: Date.now(),
    };
    dispatch({ type: "ADD_LINK", payload: link });
    toast.success("Link saved");
    setAddOpen(false);
    setForm({ title: "", url: "", description: "", label: "" });
  }

  function confirmDelete(id: string) {
    dispatch({ type: "DELETE_LINK", payload: id });
    toast.success("Link removed");
    setDeleteTarget(null);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-foreground">
            Useful Links
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {state.links.length} links saved by your group
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-ocid="links.add_button">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-5">
        {labels.map((l) => (
          <button
            type="button"
            key={l}
            onClick={() => setFilter(l)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              filter === l
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="links.empty_state"
        >
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
            <Link2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No links yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add a link to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((link, i) => (
            <div
              key={link.id}
              data-ocid={`links.item.${i + 1}`}
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/30 transition-colors"
            >
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {link.title}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded font-medium",
                      getLabelColor(link.label),
                    )}
                  >
                    {link.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {link.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  <span className="opacity-60">
                    {link.url.replace(/^https?:\/\//, "")}
                  </span>
                  {" · "}
                  <span>by {link.addedBy}</span>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => setDeleteTarget(link.id)}
                data-ocid={`links.delete_button.${i + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="links.dialog">
          <DialogHeader>
            <DialogTitle className="font-display font-normal">
              Add Link
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="e.g. MDN Web Docs"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-ocid="links.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL</Label>
              <Input
                placeholder="https://"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                data-ocid="links.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="What is this link about?"
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                data-ocid="links.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input
                placeholder="e.g. Math, CS, General"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                data-ocid="links.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="links.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.title || !form.url}
              data-ocid="links.confirm_button"
            >
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="links.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this link?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="links.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && confirmDelete(deleteTarget)}
              data-ocid="links.confirm_button"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
