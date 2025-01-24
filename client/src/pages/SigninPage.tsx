import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Link, useNavigate } from "@tanstack/react-router";
import React from "react";

const SigninPage = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { email, password } = Object.fromEntries(formData.entries());
    await auth.login(String(email), String(password));
    navigate({ to: "/" });
  };

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SigninPage;
