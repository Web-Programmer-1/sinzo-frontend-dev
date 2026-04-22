"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useRegisterUser } from "../../Apis/user/mutations";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

type TErrorResponse = {
  message?: string;
};

export default function RegisterForm() {
  const registerMutation = useRegisterUser();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await registerMutation.mutateAsync(data);

      if (res.data?.success) {
        router.push("/login");
      }

      toast.success(res.data?.message || "Registration successful");
      reset();
    } catch (error) {
      const err = error as AxiosError<TErrorResponse>;
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-[440px] overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-100 sm:p-10">
      
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-black/20">
            <Image
              src="/banners/sinzo.jpg"
              alt="Sinzo Logo"
              fill
              className="object-cover"
              sizes="80px"
              priority
            />
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Create Account
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Fill in your details to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Full Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="John Doe"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="relative mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-black text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-black/20 focus:outline-none focus:ring-4 focus:ring-black/10 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
        >
          {registerMutation.isPending ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span>Creating...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="mt-6 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="font-bold text-black transition-colors hover:text-slate-700 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}