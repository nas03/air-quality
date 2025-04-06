import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

interface SigninFormData {
  email: string;
  password: string;
}

const SigninForm = ({ onSubmit, message }: { onSubmit: (data: SigninFormData) => void; message: string }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
};

const SigninPage = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  const [message, setMessage] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();
  const params: { message: string } | null = useSearch({ from: "/public/signin" });

  useEffect(() => {
    if (params && params["message"]) {
      setMessage(params.message);
    }
  }, [params]);
  const handleSignin = async (data: SigninFormData) => {
    const status = await auth.login(data.email, data.password);
    if (!status) {
      setMessage("Invalid email or password");
      return;
    }
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <div
                  className={`animate-fadeIn mb-4 w-full overflow-hidden rounded-md border ${"border-green-200 bg-gradient-to-r from-green-50 to-green-100 text-green-700"} p-3 shadow-inner`}>
                  <div className="flex items-center">
                    <div
                      className={`mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${"bg-green-200"}`}>
                      <FiCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {message && <p className="break-words text-xs opacity-80">{message}</p>}
                    </div>
                  </div>
                </div>
              )}
              <SigninForm message={message} onSubmit={handleSignin} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
