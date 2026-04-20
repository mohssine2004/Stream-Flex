import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/AdminDashboard";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: ({ location }) => {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    const user = JSON.parse(userJson);
    if (user.role !== "admin") {
      throw redirect({
        to: "/",
      });
    }
  },
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return <AdminDashboard />;
}
