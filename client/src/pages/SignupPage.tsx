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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" type="text" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone_number" type="tel" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" className="mt-2">
        Create Account
      </Button>
      <Button variant="outline">
        <FcGoogle className="mr-2 size-5" />
        Sign up with Google
      </Button>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="font-medium text-primary hover:underline">
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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <img src="air.png" alt="logo" className="mx-auto mb-4 h-20 w-auto" />
            <CardTitle className="text-2xl">AirQ Forecast</CardTitle>
            <CardDescription>Create an account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm onSubmit={handleSignup} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
