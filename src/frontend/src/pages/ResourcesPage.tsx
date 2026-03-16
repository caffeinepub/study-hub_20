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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FileDown, FileText, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uid, useStore } from "../store";
import type { StudyFile } from "../store";

const SUBJECTS = ["All", "Math", "CS", "Physics", "English", "Other"];

const SUBJECT_COLORS: Record<string, string> = {
  Math: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  CS: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Physics:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  English: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  Other: "bg-muted text-muted-foreground",
};

export function ResourcesPage() {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSubject, setUploadSubject] = useState("Other");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = state.files.filter(
    (f) => filter === "All" || f.subject === filter,
  );

  async function handleUpload() {
    if (!uploadFile || !state.user) return;
    setUploading(true);
    try {
      const newFile: StudyFile = {
        id: uid(),
        name: uploadFile.name,
        subject: uploadSubject,
        addedBy: state.user.name,
        blobId: "local",
        size:
          uploadFile.size > 1024 * 1024
            ? `${(uploadFile.size / 1024 / 1024).toFixed(1)} MB`
            : `${Math.round(uploadFile.size / 1024)} KB`,
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_FILE", payload: newFile });
      toast.success("File added");
      setUploadOpen(false);
      setUploadFile(null);
      setUploadSubject("Other");
    } finally {
      setUploading(false);
    }
  }

  function confirmDelete(id: string) {
    dispatch({ type: "DELETE_FILE", payload: id });
    toast.success("File removed");
    setDeleteTarget(null);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-foreground">Resources</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {state.files.length} files shared by your group
          </p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          data-ocid="resources.upload_button"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-5">
        {SUBJECTS.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              filter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="resources.empty_state"
        >
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No files yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload a file to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((file, i) => (
            <div
              key={file.id}
              data-ocid={`resources.item.${i + 1}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/30 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded font-medium",
                      SUBJECT_COLORS[file.subject] ?? SUBJECT_COLORS.Other,
                    )}
                  >
                    {file.subject}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {file.size}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    by {file.addedBy}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!file.blobId && (
                  <Badge variant="secondary" className="text-xs">
                    Simulated
                  </Badge>
                )}
                {file.blobId && file.blobId !== "" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteTarget(file.id)}
                  data-ocid={`resources.delete_button.${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent data-ocid="resources.dialog">
          <DialogHeader>
            <DialogTitle className="font-display font-normal">
              Upload File
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <button
              type="button"
              className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              onClick={() => fileRef.current?.click()}
              data-ocid="resources.dropzone"
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              {uploadFile ? (
                <p className="text-sm font-medium text-foreground">
                  {uploadFile.name}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click to select a file
                </p>
              )}
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
            </button>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select value={uploadSubject} onValueChange={setUploadSubject}>
                <SelectTrigger data-ocid="resources.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Math", "CS", "Physics", "English", "Other"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadOpen(false)}
              data-ocid="resources.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              data-ocid="resources.confirm_button"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="resources.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="resources.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && confirmDelete(deleteTarget)}
              data-ocid="resources.confirm_button"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
