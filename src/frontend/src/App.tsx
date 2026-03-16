import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { CodesPage } from "./pages/CodesPage";
import { DeadlinesPage } from "./pages/DeadlinesPage";
import { LinksPage } from "./pages/LinksPage";
import { LoginPage } from "./pages/LoginPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { StoreProvider, useStore } from "./store";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  if (!state.user) return <LoginPage />;
  return <Layout>{children}</Layout>;
}

const rootRoute = createRootRoute({
  component: () => (
    <StoreProvider>
      <Outlet />
      <Toaster richColors position="top-right" />
    </StoreProvider>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => {
    const { state } = useStore();
    if (state.user) return <Navigate to="/resources" />;
    return <LoginPage />;
  },
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources",
  component: () => (
    <AuthGuard>
      <ResourcesPage />
    </AuthGuard>
  ),
});

const linksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/links",
  component: () => (
    <AuthGuard>
      <LinksPage />
    </AuthGuard>
  ),
});

const codesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/codes",
  component: () => (
    <AuthGuard>
      <CodesPage />
    </AuthGuard>
  ),
});

const deadlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deadlines",
  component: () => (
    <AuthGuard>
      <DeadlinesPage />
    </AuthGuard>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/resources" />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  resourcesRoute,
  linksRoute,
  codesRoute,
  deadlinesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
