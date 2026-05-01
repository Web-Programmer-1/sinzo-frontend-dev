"use client";

import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  Trash2,
  Mail,
  Phone,
  User2,
  Shield,
  ShieldBan,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

// Import updated hook
import { useGetAllUsers } from "../../Apis/user/queries";
import {
  useBlockUser,
  useDeleteUser,
  useUnblockUser,
  useUpdateUser,
} from "../../Apis/user/mutations";

type TUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  status: "ACTIVE" | "BLOCKED";
  fullName: string | null;
  country: string | null;
  city: string | null;
  area: string | null;
  addressLine: string | null;
  profileImage: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function CustomersManagementList() {
  // --- State Management for Pagination & Search ---
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchEmail, setSearchEmail] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openRoleDropdownId, setOpenRoleDropdownId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchEmail);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchEmail]);

  // --- Fetch Data with Params ---
  const { data, isLoading, isError, refetch } = useGetAllUsers({
    page,
    limit,
    email: debouncedSearch || undefined,
  });

  // Mutations
  const { mutate: deleteUserMutation, isPending: isDeleting } = useDeleteUser();
  const { mutate: blockUserMutation, isPending: isBlocking } = useBlockUser();
  const { mutate: unblockUserMutation, isPending: isUnblocking } = useUnblockUser();
  const { mutate: updateUserMutation, isPending: isUpdatingUser } = useUpdateUser();

  // Extract Data safely
  const users: TUser[] = data?.data || [];
  const totalUsers = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  const handleDelete = async (user: TUser) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${user.fullName || user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    deleteUserMutation(user.id, {
      onSuccess: () => {
        toast.success("User deleted successfully");
        refetch();
      },
      onError: (error: any) => toast.error(error?.message || "Failed to delete user"),
    });
  };

  const handleToggleBlock = (user: TUser) => {
    if (user.status === "ACTIVE") {
      blockUserMutation(user.id, {
        onSuccess: () => {
          toast.success("User blocked successfully");
          refetch();
        },
        onError: (error: any) => toast.error(error?.message || "Failed to block user"),
      });
    } else {
      unblockUserMutation(user.id, {
        onSuccess: () => {
          toast.success("User unblocked successfully");
          refetch();
        },
        onError: (error: any) => toast.error(error?.message || "Failed to unblock user"),
      });
    }
  };

  const handleRoleChange = (user: TUser, newRole: "ADMIN" | "CUSTOMER") => {
    if (newRole === user.role) {
      setOpenRoleDropdownId(null);
      return;
    }

    Swal.fire({
      title: "Change Role?",
      text: `Are you sure you want to change ${user.fullName || user.name}'s role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Update",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("role", newRole);

        updateUserMutation(
          { id: user.id, data: formData },
          {
            onSuccess: () => {
              toast.success("User role updated successfully");
              setOpenRoleDropdownId(null);
              refetch();
            },
            onError: (error: any) => toast.error(error?.message || "Failed to update role"),
          }
        );
      }
    });
  };

  const actionLoading = isDeleting || isBlocking || isUnblocking || isUpdatingUser;

  // --- Handlers for Pagination ---
  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  if (isLoading) return <CustomersSkeleton />;

  if (isError) {
    return (
      <div className="rounded-[28px] border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-600 shadow-sm">
        Failed to load customers.
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* Header Section with Search */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-2xl">
            Customers Management
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Manage all registered users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-slate-400 w-full sm:w-64"
            />
          </div>

          {/* Total Count Badge */}
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm min-w-[100px] text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
              Total
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {totalUsers}
            </p>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">No users found.</p>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {users.map((user) => {
              const isBlocked = user.status === "BLOCKED";

              return (
                <div key={user.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      {user.profileImage ? (
                        <Image src={user.profileImage} alt={user.name} fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><User2 className="h-6 w-6 text-slate-400" /></div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-slate-900">{user.fullName || user.name}</h2>
                          <p className="mt-0.5 truncate text-xs font-medium text-slate-500">@{user.name}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <RoleBadge role={user.role} />
                          <StatusBadge status={user.status} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <InfoRow icon={<Mail className="h-4 w-4" />} text={user.email} />
                    <InfoRow icon={<Phone className="h-4 w-4" />} text={user.phone || "No phone added"} />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button onClick={() => handleToggleBlock(user)} disabled={actionLoading} className={`relative inline-flex h-11 w-full items-center rounded-full border px-1.5 transition-all duration-300 ${isBlocked ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"}`}>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all duration-300 ${isBlocked ? "translate-x-0 bg-rose-500 text-white" : "translate-x-[calc(100%-2rem)] bg-emerald-500 text-white"}`}>
                        {isBlocked ? <ShieldBan className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </span>
                    </button>
                    <button onClick={() => handleDelete(user)} disabled={actionLoading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                  
                  <div className="mt-3">
                     <button 
                       onClick={() => setOpenRoleDropdownId(openRoleDropdownId === user.id ? null : user.id)}
                       className="w-full py-2 text-xs font-medium text-slate-500 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50"
                     >
                       Change Role ({user.role})
                     </button>
                     {openRoleDropdownId === user.id && (
                       <div className="mt-2 flex gap-2">
                         <button onClick={() => handleRoleChange(user, "ADMIN")} className="flex-1 py-1.5 text-xs font-bold text-violet-600 bg-violet-50 rounded-md hover:bg-violet-100">Admin</button>
                         <button onClick={() => handleRoleChange(user, "CUSTOMER")} className="flex-1 py-1.5 text-xs font-bold text-sky-600 bg-sky-50 rounded-md hover:bg-sky-100">Customer</button>
                       </div>
                     )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View */}
          <div className="hidden overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50/80">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">User</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Contact</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Role</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Location</th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const isBlocked = user.status === "BLOCKED";
                    const isRoleOpen = openRoleDropdownId === user.id;

                    return (
                      <tr key={user.id} className="align-top transition hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                              {user.profileImage ? (
                                <Image src={user.profileImage} alt={user.name} fill className="object-cover" sizes="48px" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center"><User2 className="h-5 w-5 text-slate-400" /></div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold tracking-[-0.01em] text-slate-900">{user.fullName || user.name}</p>
                              <p className="mt-0.5 truncate text-xs font-medium text-slate-500">@{user.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-700">{user.email}</p>
                            <p className="text-xs text-slate-500">{user.phone || "No phone added"}</p>
                          </div>
                        </td>
                        
                        {/* Role Column with Dropdown */}
                        <td className="px-6 py-4 relative">
                           <div className="relative inline-block text-left">
                              <button
                                onClick={() => setOpenRoleDropdownId(isRoleOpen ? null : user.id)}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                              >
                                <span className={user.role === 'ADMIN' ? "text-violet-600" : "text-sky-600"}>{user.role}</span>
                                <ChevronLeft className={`h-3 w-3 rotate-[-90deg] transition-transform ${isRoleOpen ? 'rotate-90' : ''}`} />
                              </button>

                              {isRoleOpen && (
                                <div className="absolute left-0 z-10 mt-2 w-32 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleRoleChange(user, "ADMIN")}
                                      className="block w-full px-4 py-2 text-left text-xs hover:bg-violet-50 text-violet-700 font-medium"
                                    >
                                      Make Admin
                                    </button>
                                    <button
                                      onClick={() => handleRoleChange(user, "CUSTOMER")}
                                      className="block w-full px-4 py-2 text-left text-xs hover:bg-sky-50 text-sky-700 font-medium"
                                    >
                                      Make Customer
                                    </button>
                                  </div>
                                </div>
                              )}
                           </div>
                        </td>

                        <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                        <td className="px-6 py-4">
                          <p className="max-w-[240px] text-sm leading-6 text-slate-600">
                            {[user.area, user.city, user.country].filter(Boolean).join(", ") || "No address info"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-end gap-3">
                             <div className="flex items-center justify-end gap-3">
                                <button onClick={() => handleToggleBlock(user)} disabled={actionLoading} className={`relative inline-flex h-10 w-[72px] items-center rounded-full border px-1.5 transition-all duration-300 ${isBlocked ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"}`}>
                                   <span className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-all duration-300 ${isBlocked ? "translate-x-0 bg-rose-500 text-white" : "translate-x-[30px] bg-emerald-500 text-white"}`}>
                                      {isBlocked ? <ShieldBan className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                                   </span>
                                </button>
                                <button onClick={() => handleDelete(user)} disabled={actionLoading} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                                   <Trash2 className="h-4 w-4" /> Delete
                                </button>
                             </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <p className="text-sm text-slate-500">
                Showing page <span className="font-medium text-slate-900">{page}</span> of{" "}
                <span className="font-medium text-slate-900">{totalPages || 1}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages || totalPages === 0}
                  className="inline-flex items-center gap-1 rounded-lg border border-transparent bg-black px-3 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:active:scale-100"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </>
      )}
    </section>
  );
}

function InfoRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
      <span className="mt-1 shrink-0 text-slate-400">{icon}</span>
      <span className="break-words font-medium">{text}</span>
    </div>
  );
}

function RoleBadge({ role }: { role: "ADMIN" | "CUSTOMER" }) {
  const isAdmin = role === "ADMIN";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] ${isAdmin ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: "ACTIVE" | "BLOCKED" }) {
  const isActive = status === "ACTIVE";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
      {status}
    </span>
  );
}

function CustomersSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-14 w-14 rounded-2xl bg-slate-200" />
            <div className="flex-1">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-24 rounded bg-slate-200" />
            </div>
            <div className="h-6 w-20 rounded-full bg-slate-200" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-slate-200" />
            <div className="h-3 w-3/4 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}