import { Link, useNavigate } from "@tanstack/react-router";
import React from "react";
import { FcGoogle } from "react-icons/fc";

import { createUser } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupFormData {
  username: string;
  email: string;
  phone_number: string;
  password: string;
}

const SignupForm = ({ onSubmit }: { onSubmit: (data: SignupFormData) => Promise<void> }) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    await onSubmit({
      username: String(data.username),
      email: String(data.email),
      phone_number: String(data.phone_number),
      password: String(data.password),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-3">
        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          required
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone_number"
          type="tel"
          required
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <Button
        type="submit"
        className="mt-4 w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        Create Account
      </Button>
      <Button
        variant="outline"
        className="mt-2 flex w-full items-center justify-center border-gray-300 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        <FcGoogle className="mr-2 h-5 w-5" />
        Sign up with Google
      </Button>
      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/signin" className="font-medium text-indigo-600 hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
};

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async (data: SignupFormData) => {
    try {
      await createUser(data);
      navigate({
        to: "/signin",
        search: {
          message: "Vui lòng kiểm tra email để kích hoạt tài khoản",
        },
      });
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="rounded-t-md bg-gradient-to-r from-[#003366] to-[#1a237e] py-6 text-center text-white">
            <Link to="/" className="inline-block">
              <CardTitle className="flex flex-row items-center justify-center gap-3 text-2xl text-white hover:opacity-90 transition-opacity">
                <img src="/logo_no_text.svg" alt="logo" className="h-8 w-auto" />
                <p>Airly</p>
              </CardTitle>
              <CardDescription className="text-sm text-gray-200">Air Quality Forecast System</CardDescription>
            </Link>
          </CardHeader>
          <CardContent className="rounded-b-md bg-white p-6">
            <SignupForm onSubmit={handleSignup} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
