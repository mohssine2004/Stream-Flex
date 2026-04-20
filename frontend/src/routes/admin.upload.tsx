import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminUpload } from "@/components/AdminUpload";

export const Route = createFileRoute("/admin/upload")({
  beforeLoad: ({ location }) => {
    // Check if user is logged in and is an admin
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
      // If not admin, redirect to home
      throw redirect({
        to: "/",
      });
    }
  },
  component: AdminUploadPage,
});

function AdminUploadPage() {
  return <AdminUpload />;
}
