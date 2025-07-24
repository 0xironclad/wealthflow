"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from './actions';
import dynamic from 'next/dynamic';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const Card = dynamic(() => import("@/components/ui/card").then(mod => mod.Card));
const CardContent = dynamic(() => import("@/components/ui/card").then(mod => mod.CardContent));
const CardDescription = dynamic(() => import("@/components/ui/card").then(mod => mod.CardDescription));
const CardFooter = dynamic(() => import("@/components/ui/card").then(mod => mod.CardFooter));
const CardHeader = dynamic(() => import("@/components/ui/card").then(mod => mod.CardHeader));
const CardTitle = dynamic(() => import("@/components/ui/card").then(mod => mod.CardTitle));
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

import { useToast } from "@/hooks/use-toast";

const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(50, {
      message: "Password must not be more than 50 characters",
    }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormValues) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);

      const results = await login(formData);

      if (results.success) {
        toast({
          title: "Success",
          description: "You have successfully signed in.",
        });
        router.push('/overview')
      } else {
        toast({
          title: "Error",
          description: results.error || "Failed to sign in. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form<SignInFormValues> {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Social Sign In */}
          <div className="flex items-center justify-between gap-2 py-4">
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
            <span className="relative z-10 px-2 text-muted-foreground">
              Or continue with
            </span>
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="grid grid-cols-2 gap-4 py-2">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              disabled={isLoading}
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "GitHub login will be available soon.",
                });
              }}
            >
              <BsGithub size={24} />
              <span className="sr-only">Login with GitHub</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              disabled={isLoading}
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Google login will be available soon.",
                });
              }}
            >
              <FcGoogle size={24} />
              <span className="sr-only">Login with Google</span>
            </Button>
          </div>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline" prefetch={true}>
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default SignInPage;
