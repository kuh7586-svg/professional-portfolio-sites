import {
  MusicDock,
  MusicProvider,
  TransitionLink,
  TransitionProvider,
} from "@/components/shared";
import { ArchHome, ArchProject } from "@/sites/architecture";
import {
  ClinicBooking,
  ClinicDoctors,
  ClinicHome,
  ClinicLayout,
  ClinicPrices,
} from "@/sites/clinic";
import { DetailingHome } from "@/sites/detailing";
import { JumpHome } from "@/sites/jump";
import { PortfolioHome } from "@/sites/portfolio";
import { RestaurantHome } from "@/sites/restaurant";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

function Shell() {
  return (
    <MusicProvider>
      <TransitionProvider>
        <Outlet />
        <MusicDock />
      </TransitionProvider>
    </MusicProvider>
  );
}

function NotFound() {
  return (
    <main
      data-ocid="notfound.page"
      className="theme-portfolio flex min-h-screen flex-col items-start justify-center gap-6 px-5 md:px-10"
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-2">
        404
      </span>
      <h1 className="font-display text-4xl leading-[0.95] tracking-tight sm:text-6xl">
        Такой страницы нет
      </h1>
      <TransitionLink
        to="/"
        data-ocid="notfound.home.link"
        className="link-draw text-lg"
      >
        ← в портфолио
      </TransitionLink>
    </main>
  );
}

const rootRoute = createRootRoute({
  component: Shell,
  notFoundComponent: NotFound,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: PortfolioHome,
});

const clinicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/work/clinic",
  component: ClinicLayout,
});
const clinicIndexRoute = createRoute({
  getParentRoute: () => clinicRoute,
  path: "/",
  component: ClinicHome,
});
const clinicDoctorsRoute = createRoute({
  getParentRoute: () => clinicRoute,
  path: "doctors",
  component: ClinicDoctors,
});
const clinicPricesRoute = createRoute({
  getParentRoute: () => clinicRoute,
  path: "prices",
  component: ClinicPrices,
});
const clinicBookingRoute = createRoute({
  getParentRoute: () => clinicRoute,
  path: "booking",
  component: ClinicBooking,
});

const jumpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/work/jump",
  component: JumpHome,
});

const archRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/work/architecture",
  component: ArchHome,
});
const archProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/work/architecture/$projectId",
  component: ArchProject,
});

const detailingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/work/detailing",
  component: DetailingHome,
});
const restaurantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/work/restaurant",
  component: RestaurantHome,
});

const routeTree = rootRoute.addChildren([
  portfolioRoute,
  clinicRoute.addChildren([
    clinicIndexRoute,
    clinicDoctorsRoute,
    clinicPricesRoute,
    clinicBookingRoute,
  ]),
  jumpRoute,
  archRoute,
  archProjectRoute,
  detailingRoute,
  restaurantRoute,
]);

const router = createRouter({ routeTree, defaultPreload: "intent" });

export default function App() {
  return <RouterProvider router={router} />;
}
