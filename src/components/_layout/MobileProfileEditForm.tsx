"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import { useUpdateUser } from "../../Apis/user/mutations";
import { useGetMe } from "../../Apis/user/queries";

export default function MobileProfileEditForm() {
  const { data, isLoading } = useGetMe();
  const { mutateAsync, isPending } = useUpdateUser();

  const user = data?.data;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [preview, setPreview] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;

    setFullName(user.fullName || "");
    setPhone(user.phone || "");
    setCountry(user.country || "");
    setCity(user.city || "");
    setArea(user.area || "");
    setAddressLine(user.addressLine || "");
    setPreview(user.profileImage || "");
  }, [user]);

  const initials = useMemo(() => {
    const sourceName = user?.fullName || user?.name || "U";
    return sourceName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join("");
  }, [user?.fullName, user?.name]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

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

      toast.success(res?.data?.message || "Profile updated successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-12 animate-pulse rounded-2xl bg-zinc-100" />
          <div className="h-12 animate-pulse rounded-2xl bg-zinc-100" />
          <div className="h-12 animate-pulse rounded-2xl bg-zinc-100" />
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-red-500">
          Profile data load hoy nai.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <div className="border-b border-zinc-100 p-5">
        <h2 className="text-xl font-bold text-black">Edit Profile</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Update your account information
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 text-xl font-semibold text-black">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Profile Preview"
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

        <div className="grid grid-cols-1 gap-4">
          <Field
            label="Name"
            value={user.name || ""}
            disabled
            placeholder="Your account name"
          />

          <Field
            label="Email"
            value={user.email || ""}
            disabled
            placeholder="Your email"
          />

          <Field
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            placeholder="Enter full name"
          />

          <Field
            label="Phone"
            value={phone}
            onChange={setPhone}
            placeholder="Enter phone number"
          />

          <Field
            label="Country"
            value={country}
            onChange={setCountry}
            placeholder="Enter country"
          />

          <Field
            label="City"
            value={city}
            onChange={setCity}
            placeholder="Enter city"
          />

          <Field
            label="Area"
            value={area}
            onChange={setArea}
            placeholder="Enter area"
          />

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
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500"
      />
    </div>
  );
}