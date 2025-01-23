import { FcGoogle } from "react-icons/fc";

import { createUser } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import React from "react";

const Signup = () => {
  const navigate = useNavigate();
  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entries = Object.fromEntries(formData.entries());
    const username = String(entries.username);
    const email = String(entries.email);
    const phone_number = String(entries.phone_number);
    const password = String(entries.password);

    try {
      await createUser({ username, email, phone_number, password });
      navigate({ to: "/signin" });
    } catch (error) {
      // TODO: Handle error
      return null;
    }
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div className="mb-6 flex flex-col items-center">
              <img src="air.png" alt="logo" className="mb-7 h-20 w-auto" />
              <p className="mb-2 text-2xl font-bold">AirQ Forecast</p>
            </div>
            <div>
              <form onSubmit={handleCreateAccount} className="grid gap-4">
                <Input type="text" name="username" placeholder="Username" required />
                <Input type="email" name="email" placeholder="Email" required />
                <Input type="tel" name="phone_number" placeholder="Phone number" required />
                <Input type="password" name="password" placeholder="Enter your password" required />
                <Button type="submit" className="mt-2 w-full">
                  Create an account
                </Button>
                <Button variant="outline" className="w-full">
                  <FcGoogle className="mr-2 size-5" />
                  Sign up with Google
                </Button>
              </form>
              <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                <p>Already have an account?</p>
                <Link to="/signin" className="font-medium text-primary">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
