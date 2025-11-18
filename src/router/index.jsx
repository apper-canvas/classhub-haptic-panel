import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Classes = lazy(() => import("@/components/pages/Classes"));
const ClassDetail = lazy(() => import("@/components/pages/ClassDetail"));
const Students = lazy(() => import("@/components/pages/Students"));
const StudentProfile = lazy(() => import("@/components/pages/StudentProfile"));
const Assignments = lazy(() => import("@/components/pages/Assignments"));
const Grades = lazy(() => import("@/components/pages/Grades"));
const Attendance = lazy(() => import("@/components/pages/Attendance"));
const Calendar = lazy(() => import("@/components/pages/Calendar"));
const Activity = lazy(() => import("@/components/pages/Activity"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const loadingFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={loadingFallback}><Dashboard /></Suspense>
  },
  {
    path: "classes",
    element: <Suspense fallback={loadingFallback}><Classes /></Suspense>
  },
  {
    path: "classes/:id",
    element: <Suspense fallback={loadingFallback}><ClassDetail /></Suspense>
  },
  {
    path: "students",
    element: <Suspense fallback={loadingFallback}><Students /></Suspense>
  },
  {
    path: "students/:id",
    element: <Suspense fallback={loadingFallback}><StudentProfile /></Suspense>
  },
  {
    path: "assignments",
    element: <Suspense fallback={loadingFallback}><Assignments /></Suspense>
  },
  {
    path: "grades",
    element: <Suspense fallback={loadingFallback}><Grades /></Suspense>
  },
{
path: "attendance",
element: <Suspense fallback={loadingFallback}><Attendance /></Suspense>
},
{
path: "calendar",
element: <Suspense fallback={loadingFallback}><Calendar /></Suspense>
},
{
  path: "activity",
  element: <Suspense fallback={loadingFallback}><Activity /></Suspense>
},
{
  path: "*",
  element: <Suspense fallback={loadingFallback}><NotFound /></Suspense>
}
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);