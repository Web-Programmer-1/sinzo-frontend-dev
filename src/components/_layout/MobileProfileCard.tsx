


"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useGetMe } from "../../Apis/user/queries";
import { useUpdateUser } from "../../Apis/user/mutations";


export default function MobileProfileCard() {
  const { data, isLoading, isError } = useGetMe();
  const { mutateAsync, isPending } = useUpdateUser();

  const user = data?.data;
  const isLoggedIn = !!user?.id;

  const initials = useMemo(
    () =>
      user?.name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part[0]?.toUpperCase())
        .join("") || "U",
    [user?.name]
  );

  const [openEditModal, setOpenEditModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!user) return;

    setFullName(user.fullName || "");
    setPhone(user.phone || "");
    setCountry(user.country || "");
    setCity(user.city || "");
    setArea(user.area || "");
    setAddressLine(user.addressLine || "");
    setPreviewImage(user.profileImage || "");
  }, [user, openEditModal]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("phone", phone);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("area", area);
      formData.append("addressLine", addressLine);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await mutateAsync({
        id: user.id,
        data: formData,
      });

      setOpenEditModal(false);
      alert(res?.data?.message || "Profile updated successfully");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 animate-pulse rounded-full bg-zinc-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-44 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !isLoggedIn) {
    return (
      <div className="w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-semibold text-black">
              You are not logged in
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Login to view your profile, orders and account details.
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="bg-gradient-to-r from-zinc-50 via-white to-zinc-50 p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-black/5"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-lg font-semibold text-white ring-2 ring-black/5">
                  {initials}
                </div>
              )}

              <span className="absolute -bottom-1 -right-1 rounded-full border border-white bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                {user.status}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold text-black">
                {user.fullName || user.name}
              </h2>
              <p className="truncate text-sm text-zinc-500">{user.email}</p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {user.role}
                </span>

                {user.phone && (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium text-zinc-600">
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 p-5">
          <div className="rounded-2xl bg-zinc-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              City
            </p>
            <p className="mt-1 text-sm font-semibold text-black">
              {user.city || "Not set"}
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Country
            </p>
            <p className="mt-1 text-sm font-semibold text-black">
              {user.country || "Not set"}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl bg-zinc-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Address
            </p>
            <p className="mt-1 text-sm font-semibold text-black">
              {user.addressLine || "No address added yet"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-zinc-100 p-5">
          <Link
            href="/userDashboard"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
             Dashboard
          </Link>

          <button
            type="button"
            onClick={() => setOpenEditModal(true)}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-black transition hover:border-black"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {openEditModal && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4">
              <h3 className="text-lg font-bold text-black">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setOpenEditModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:border-black hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 text-xl font-semibold text-black">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:border-black">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter country"
                  className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Area
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter area"
                  className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Address
                </label>
                <textarea
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Enter address"
                  rows={4}
                  className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenEditModal(false)}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-black transition hover:border-black"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  disabled={isPending}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}