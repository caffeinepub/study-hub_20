import type React from "react";
import { createContext, useContext, useEffect, useReducer } from "react";

export type Theme = "light" | "dark" | "warm" | "cool" | "contrast";

export interface StudyLink {
  id: string;
  title: string;
  url: string;
  description: string;
  label: string;
  addedBy: string;
  timestamp: number;
}

export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  topic: string;
  addedBy: string;
  timestamp: number;
}

export interface Deadline {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  urgency: "low" | "medium" | "high";
  addedBy: string;
  timestamp: number;
}

export interface StudyFile {
  id: string;
  name: string;
  subject: string;
  addedBy: string;
  blobId: string;
  size: string;
  timestamp: number;
}

interface State {
  user: { name: string } | null;
  theme: Theme;
  links: StudyLink[];
  snippets: CodeSnippet[];
  deadlines: Deadline[];
  files: StudyFile[];
}

type Action =
  | { type: "SET_USER"; payload: { name: string } | null }
  | { type: "SET_THEME"; payload: Theme }
  | { type: "ADD_LINK"; payload: StudyLink }
  | { type: "DELETE_LINK"; payload: string }
  | { type: "ADD_SNIPPET"; payload: CodeSnippet }
  | { type: "DELETE_SNIPPET"; payload: string }
  | { type: "ADD_DEADLINE"; payload: Deadline }
  | { type: "DELETE_DEADLINE"; payload: string }
  | { type: "ADD_FILE"; payload: StudyFile }
  | { type: "DELETE_FILE"; payload: string };

const SEED_LINKS: StudyLink[] = [
  {
    id: "l1",
    title: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu",
    description: "Free lecture notes, exams, and videos from MIT.",
    label: "General",
    addedBy: "Mr Doari",
    timestamp: Date.now() - 86400000 * 5,
  },
  {
    id: "l2",
    title: "Khan Academy",
    url: "https://khanacademy.org",
    description:
      "Covers math, science, and computing with interactive exercises.",
    label: "Math",
    addedBy: "Ms Samanta",
    timestamp: Date.now() - 86400000 * 4,
  },
  {
    id: "l3",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Comprehensive JavaScript and web API documentation.",
    label: "CS",
    addedBy: "Mr Sarkar",
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: "l4",
    title: "Wolfram Alpha",
    url: "https://wolframalpha.com",
    description: "Powerful computation and math problem solving engine.",
    label: "Math",
    addedBy: "Mr Dey",
    timestamp: Date.now() - 86400000 * 2,
  },
];

const SEED_SNIPPETS: CodeSnippet[] = [
  {
    id: "s1",
    title: "Binary Search",
    language: "Python",
    topic: "Algorithms",
    addedBy: "Anonymous",
    timestamp: Date.now() - 86400000 * 3,
    code: "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
  },
  {
    id: "s2",
    title: "Merge Sort",
    language: "JavaScript",
    topic: "Algorithms",
    addedBy: "Mr Doari",
    timestamp: Date.now() - 86400000 * 2,
    code: "function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) result.push(left[i++]);\n    else result.push(right[j++]);\n  }\n  return result.concat(left.slice(i)).concat(right.slice(j));\n}",
  },
  {
    id: "s3",
    title: "Dijkstra's Algorithm",
    language: "Python",
    topic: "Graphs",
    addedBy: "Ms Samanta",
    timestamp: Date.now() - 86400000,
    code: `import heapq\n\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]:\n            continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist`,
  },
];

const SEED_DEADLINES: Deadline[] = [
  {
    id: "d1",
    title: "Calculus Final Exam",
    subject: "Math",
    dueDate: "2026-03-25",
    urgency: "high",
    addedBy: "Mr Doari",
    timestamp: Date.now() - 86400000 * 4,
  },
  {
    id: "d2",
    title: "Data Structures Assignment 3",
    subject: "CS",
    dueDate: "2026-03-20",
    urgency: "medium",
    addedBy: "Ms Samanta",
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: "d3",
    title: "Physics Lab Report",
    subject: "Physics",
    dueDate: "2026-03-18",
    urgency: "high",
    addedBy: "Mr Sarkar",
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: "d4",
    title: "Literature Essay Draft",
    subject: "English",
    dueDate: "2026-04-02",
    urgency: "low",
    addedBy: "Mr Dey",
    timestamp: Date.now() - 86400000,
  },
];

const SEED_FILES: StudyFile[] = [
  {
    id: "f1",
    name: "Calculus Cheat Sheet.pdf",
    subject: "Math",
    addedBy: "Mr Doari",
    blobId: "",
    size: "420 KB",
    timestamp: Date.now() - 86400000 * 5,
  },
  {
    id: "f2",
    name: "Data Structures Notes.pdf",
    subject: "CS",
    addedBy: "Anonymous",
    blobId: "",
    size: "1.2 MB",
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: "f3",
    name: "Physics Formula Sheet.pdf",
    subject: "Physics",
    addedBy: "Mr Sarkar",
    blobId: "",
    size: "280 KB",
    timestamp: Date.now() - 86400000 * 2,
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function getInitialState(): State {
  const links = loadFromStorage<StudyLink[] | null>("studyhub_links", null);
  const snippets = loadFromStorage<CodeSnippet[] | null>(
    "studyhub_snippets",
    null,
  );
  const deadlines = loadFromStorage<Deadline[] | null>(
    "studyhub_deadlines",
    null,
  );
  const files = loadFromStorage<StudyFile[] | null>("studyhub_files", null);

  return {
    user: loadFromStorage("studyhub_user", null),
    theme: loadFromStorage<Theme>("studyhub_theme", "light"),
    links: links ?? SEED_LINKS,
    snippets: snippets ?? SEED_SNIPPETS,
    deadlines: deadlines ?? SEED_DEADLINES,
    files: files ?? SEED_FILES,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "ADD_LINK":
      return { ...state, links: [action.payload, ...state.links] };
    case "DELETE_LINK":
      return {
        ...state,
        links: state.links.filter((l) => l.id !== action.payload),
      };
    case "ADD_SNIPPET":
      return { ...state, snippets: [action.payload, ...state.snippets] };
    case "DELETE_SNIPPET":
      return {
        ...state,
        snippets: state.snippets.filter((s) => s.id !== action.payload),
      };
    case "ADD_DEADLINE":
      return { ...state, deadlines: [action.payload, ...state.deadlines] };
    case "DELETE_DEADLINE":
      return {
        ...state,
        deadlines: state.deadlines.filter((d) => d.id !== action.payload),
      };
    case "ADD_FILE":
      return { ...state, files: [action.payload, ...state.files] };
    case "DELETE_FILE":
      return {
        ...state,
        files: state.files.filter((f) => f.id !== action.payload),
      };
    default:
      return state;
  }
}

interface StoreContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    localStorage.setItem("studyhub_user", JSON.stringify(state.user));
  }, [state.user]);
  useEffect(() => {
    localStorage.setItem("studyhub_theme", JSON.stringify(state.theme));
  }, [state.theme]);
  useEffect(() => {
    localStorage.setItem("studyhub_links", JSON.stringify(state.links));
  }, [state.links]);
  useEffect(() => {
    localStorage.setItem("studyhub_snippets", JSON.stringify(state.snippets));
  }, [state.snippets]);
  useEffect(() => {
    localStorage.setItem("studyhub_deadlines", JSON.stringify(state.deadlines));
  }, [state.deadlines]);
  useEffect(() => {
    localStorage.setItem("studyhub_files", JSON.stringify(state.files));
  }, [state.files]);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
