import Dashboard from "../../components/_Dashboard/dashboard";
import ProtectedRoute from "../../shared/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (

      <ProtectedRoute  allowedRoles={["ADMIN"]}>

        <Dashboard>{children}</Dashboard>
      </ProtectedRoute>

  );
}