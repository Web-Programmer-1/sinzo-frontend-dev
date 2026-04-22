




"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  Trash2,
  Mail,
  Phone,
  MapPin,
  User2,
  Shield,
  ShieldBan,
  Loader2,
  ChevronDown,
  Check,
  UserCog,
} from "lucide-react";

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

type TRole = "ADMIN" | "CUSTOMER";

export default function CustomersManagementList() {
  const { data, isLoading, isError } = useGetAllUsers();

  const { mutate: deleteUserMutation, isPending: isDeleting } = useDeleteUser();
  const { mutate: blockUserMutation, isPending: isBlocking } = useBlockUser();
  const { mutate: unblockUserMutation, isPending: isUnblocking } =
    useUnblockUser();
  const { mutate: updateUserMutation, isPending: isUpdatingUser } =
    useUpdateUser();

  const [openRoleDropdownId, setOpenRoleDropdownId] = useState<string | null>(
    null
  );
  const [selectedRoles, setSelectedRoles] = useState<Record<string, TRole>>({});

  const users: TUser[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

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
      background: "#ffffff",
      color: "#0f172a",
    });

    if (!result.isConfirmed) return;

    deleteUserMutation(user.id, {
      onSuccess: () => {
        toast.success("User deleted successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete user");
      },
    });
  };

  const handleToggleBlock = (user: TUser) => {
    if (user.status === "ACTIVE") {
      blockUserMutation(user.id, {
        onSuccess: () => {
          toast.success("User blocked successfully");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to block user");
        },
      });
    } else {
      unblockUserMutation(user.id, {
        onSuccess: () => {
          toast.success("User unblocked successfully");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to unblock user");
        },
      });
    }
  };

  const handleRoleUpdate = async (user: TUser) => {
    const nextRole = selectedRoles[user.id] || user.role;

    if (nextRole === user.role) {
      toast.info("Please select a different role first");
      return;
    }

    const result = await Swal.fire({
      title: "Update role?",
      text: `${user.fullName || user.name} will be changed to ${nextRole}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, update role",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#ffffff",
      color: "#0f172a",
    });

    if (!result.isConfirmed) return;

    const formData = new FormData();
    formData.append("role", nextRole);

    updateUserMutation(
      { id: user.id, data: formData },
      {
        onSuccess: () => {
          toast.success("User role updated successfully");
          setOpenRoleDropdownId(null);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update role");
        },
      }
    );
  };

  const actionLoading =
    isDeleting || isBlocking || isUnblocking || isUpdatingUser;

  const getSelectedRole = (user: TUser): TRole =>
    selectedRoles[user.id] || user.role;

  if (isLoading) {
    return <CustomersSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-[28px] border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-600 shadow-sm">
        Failed to load customers.
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-2xl">
            Customers Management
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Manage all registered users with block, unblock, role update and
            delete actions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
            Total Users
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {users.length}
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">No users found.</p>
        </div>
      ) : (
        <>
          {/* Mobile / Tablet */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {users.map((user) => {
              const isBlocked = user.status === "BLOCKED";
              const isRoleOpen = openRoleDropdownId === user.id;
              const currentSelectedRole = getSelectedRole(user);

              return (
                <div
                  key={user.id}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      {user.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User2 className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
                            {user.fullName || user.name}
                          </h2>
                          <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                            @{user.name}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <RoleBadge role={user.role} />
                          <StatusBadge status={user.status} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <InfoRow
                      icon={<Mail className="h-4 w-4" />}
                      text={user.email}
                    />
                    <InfoRow
                      icon={<Phone className="h-4 w-4" />}
                      text={user.phone || "No phone added"}
                    />
                    <InfoRow
                      icon={<MapPin className="h-4 w-4" />}
                      text={
                        [user.area, user.city, user.country]
                          .filter(Boolean)
                          .join(", ") || "No address info"
                      }
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleBlock(user)}
                      disabled={actionLoading}
                      className={`relative inline-flex h-11 w-full items-center rounded-full border px-1.5 transition-all duration-300 ${
                        isBlocked
                          ? "border-rose-200 bg-rose-50"
                          : "border-emerald-200 bg-emerald-50"
                      } ${actionLoading ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all duration-300 ${
                          isBlocked
                            ? "translate-x-0 bg-rose-500 text-white"
                            : "translate-x-[calc(100%-2rem)] bg-emerald-500 text-white"
                        }`}
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isBlocked ? (
                          <ShieldBan className="h-4 w-4" />
                        ) : (
                          <Shield className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenRoleDropdownId(isRoleOpen ? null : user.id)
                      }
                      disabled={actionLoading}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <UserCog className="h-4 w-4" />
                      Update Role
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isRoleOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {isRoleOpen && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Select Role
                      </label>

                      <select
                        value={currentSelectedRole}
                        onChange={(e) =>
                          setSelectedRoles((prev) => ({
                            ...prev,
                            [user.id]: e.target.value as TRole,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleRoleUpdate(user)}
                          disabled={
                            actionLoading || currentSelectedRole === user.role
                          }
                          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdatingUser ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Save Role
                        </button>

                        <button
                          type="button"
                          onClick={() => setOpenRoleDropdownId(null)}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(user)}
                    disabled={actionLoading}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              );
            })}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50/80">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      User
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Role
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Location
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const isBlocked = user.status === "BLOCKED";
                    const isRoleOpen = openRoleDropdownId === user.id;
                    const currentSelectedRole = getSelectedRole(user);

                    return (
                      <tr
                        key={user.id}
                        className="align-top transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                              {user.profileImage ? (
                                <Image
                                  src={user.profileImage}
                                  alt={user.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <User2 className="h-5 w-5 text-slate-400" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold tracking-[-0.01em] text-slate-900">
                                {user.fullName || user.name}
                              </p>
                              <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                                @{user.name}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-700">
                              {user.email}
                            </p>
                            <p className="text-xs text-slate-500">
                              {user.phone || "No phone added"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <RoleBadge role={user.role} />
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={user.status} />
                        </td>

                        <td className="px-6 py-4">
                          <p className="max-w-[240px] text-sm leading-6 text-slate-600">
                            {[user.area, user.city, user.country]
                              .filter(Boolean)
                              .join(", ") || "No address info"}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => handleToggleBlock(user)}
                                disabled={actionLoading}
                                className={`relative inline-flex h-10 w-[72px] items-center rounded-full border px-1.5 transition-all duration-300 ${
                                  isBlocked
                                    ? "border-rose-200 bg-rose-50"
                                    : "border-emerald-200 bg-emerald-50"
                                } ${
                                  actionLoading
                                    ? "cursor-not-allowed opacity-60"
                                    : ""
                                }`}
                              >
                                <span
                                  className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-all duration-300 ${
                                    isBlocked
                                      ? "translate-x-0 bg-rose-500 text-white"
                                      : "translate-x-[30px] bg-emerald-500 text-white"
                                  }`}
                                >
                                  {actionLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : isBlocked ? (
                                    <ShieldBan className="h-4 w-4" />
                                  ) : (
                                    <Shield className="h-4 w-4" />
                                  )}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setOpenRoleDropdownId(
                                    isRoleOpen ? null : user.id
                                  )
                                }
                                disabled={actionLoading}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <UserCog className="h-4 w-4" />
                                Update Role
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform duration-200 ${
                                    isRoleOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>

                              <button
                                onClick={() => handleDelete(user)}
                                disabled={actionLoading}
                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>

                            {isRoleOpen && (
                              <div className="w-[240px] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                                <label className="mb-2 block text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                  Update User Role
                                </label>

                                <select
                                  value={currentSelectedRole}
                                  onChange={(e) =>
                                    setSelectedRoles((prev) => ({
                                      ...prev,
                                      [user.id]: e.target.value as TRole,
                                    }))
                                  }
                                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
                                >
                                  <option value="CUSTOMER">CUSTOMER</option>
                                  <option value="ADMIN">ADMIN</option>
                                </select>

                                <div className="mt-3 flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleRoleUpdate(user)}
                                    disabled={
                                      actionLoading ||
                                      currentSelectedRole === user.role
                                    }
                                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isUpdatingUser ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                    Save
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setOpenRoleDropdownId(null)}
                                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
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
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] ${
        isAdmin
          ? "bg-violet-100 text-violet-700"
          : "bg-sky-100 text-sky-700"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: "ACTIVE" | "BLOCKED" }) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      {status}
    </span>
  );
}

function CustomersSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm"
        >
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
            <div className="h-3 w-2/3 rounded bg-slate-200" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="h-11 w-[78px] rounded-full bg-slate-200" />
            <div className="h-11 w-24 rounded-2xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}