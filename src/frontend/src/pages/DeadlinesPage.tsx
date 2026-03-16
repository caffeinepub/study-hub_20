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
import { cn } from "@/lib/utils";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uid, useStore } from "../store";
import type { Deadline } from "../store";

const SUBJECTS = ["Math", "CS", "Physics", "English", "Other"];

const URGENCY_CONFIG = {
  high: {
    label: "High",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
  medium: {
    label: "Medium",
    dot: "bg-amber-500",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  low: {
    label: "Low",
    dot: "bg-green-500",
    badge:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
};

const SUBJECT_COLORS: Record<string, string> = {
  Math: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  CS: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Physics:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  English: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  Other: "bg-muted text-muted-foreground",
};

function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysUntil(dateStr: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(`${dateStr}T00:00:00`);
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}

export function DeadlinesPage() {
  const { state, dispatch } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    subject: "Math",
    dueDate: "",
    urgency: "medium" as Deadline["urgency"],
  });

  const sorted = [...state.deadlines].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );

  function handleAdd() {
    if (!form.title || !form.dueDate || !state.user) return;
    const deadline: Deadline = {
      id: uid(),
      title: form.title,
      subject: form.subject,
      dueDate: form.dueDate,
      urgency: form.urgency,
      addedBy: state.user.name,
      timestamp: Date.now(),
    };
    dispatch({ type: "ADD_DEADLINE", payload: deadline });
    toast.success("Deadline added");
    setAddOpen(false);
    setForm({ title: "", subject: "Math", dueDate: "", urgency: "medium" });
  }

  function confirmDelete(id: string) {
    dispatch({ type: "DELETE_DEADLINE", payload: id });
    toast.success("Deadline removed");
    setDeleteTarget(null);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-foreground">Deadlines</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {state.deadlines.length} upcoming events
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          data-ocid="deadlines.add_button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Deadline
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="deadlines.empty_state"
        >
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
            <CalendarClock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No deadlines yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add an exam or assignment deadline
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((deadline, i) => {
            const days = daysUntil(deadline.dueDate);
            const overdue = days < 0;
            const urg = URGENCY_CONFIG[deadline.urgency];

            return (
              <div
                key={deadline.id}
                data-ocid={`deadlines.item.${i + 1}`}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border bg-card shadow-xs transition-colors",
                  overdue
                    ? "border-border opacity-60"
                    : "border-border hover:border-primary/30",
                )}
              >
                {/* Urgency dot */}
                <div
                  className={cn("h-2.5 w-2.5 rounded-full shrink-0", urg.dot)}
                />

                {/* Date block */}
                <div className="text-center w-12 shrink-0">
                  <div
                    className={cn(
                      "text-base font-bold font-display leading-none",
                      overdue ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {formatDate(deadline.dueDate)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        overdue && "line-through text-muted-foreground",
                      )}
                    >
                      {deadline.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded font-medium",
                        SUBJECT_COLORS[deadline.subject] ??
                          SUBJECT_COLORS.Other,
                      )}
                    >
                      {deadline.subject}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded font-medium",
                        urg.badge,
                      )}
                    >
                      {urg.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      by {deadline.addedBy}
                    </span>
                  </div>
                </div>

                {/* Days until */}
                <div className="text-right shrink-0">
                  {overdue ? (
                    <span className="text-xs text-muted-foreground">
                      Overdue
                    </span>
                  ) : days === 0 ? (
                    <span className="text-xs font-semibold text-red-600">
                      Today
                    </span>
                  ) : days === 1 ? (
                    <span className="text-xs font-semibold text-amber-600">
                      Tomorrow
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        days <= 3
                          ? "text-red-600"
                          : days <= 7
                            ? "text-amber-600"
                            : "text-muted-foreground",
                      )}
                    >
                      {days}d
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => setDeleteTarget(deadline.id)}
                  data-ocid={`deadlines.delete_button.${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Deadline Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="deadlines.dialog">
          <DialogHeader>
            <DialogTitle className="font-display font-normal">
              Add Deadline
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="e.g. Calculus Final Exam"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-ocid="deadlines.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Select
                  value={form.subject}
                  onValueChange={(v) => setForm({ ...form, subject: v })}
                >
                  <SelectTrigger data-ocid="deadlines.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Urgency</Label>
                <Select
                  value={form.urgency}
                  onValueChange={(v) =>
                    setForm({ ...form, urgency: v as Deadline["urgency"] })
                  }
                >
                  <SelectTrigger data-ocid="deadlines.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                data-ocid="deadlines.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="deadlines.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.title || !form.dueDate}
              data-ocid="deadlines.confirm_button"
            >
              Add Deadline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="deadlines.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this deadline?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="deadlines.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && confirmDelete(deleteTarget)}
              data-ocid="deadlines.confirm_button"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
