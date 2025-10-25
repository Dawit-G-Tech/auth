"use client";
import { z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { OctagonAlertIcon,EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form"; 
import { useRouter } from "next/navigation";
import {FaGoogle} from "react-icons/fa";
import { useState } from "react";

import {Input} from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Card, CardContent} from "@/components/ui/card";
import {Alert, AlertTitle} from "@/components/ui/alert";
import Link from "next/link";


const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is Required"),
});


export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
    
    try {
      await authClient.login({
        email: data.email,
        password: data.password,
      });
      setPending(false);
      router.push("/");
    } catch (error: any) {
      setPending(false);
      setError(error.message || "Login failed");
    }
  };

  const onSocial = (provider: "google") => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    window.location.href = `${backendUrl}/api/auth/${provider}`;
  };

  return (
    <div className="flex flex-col - gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Welcome Back
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField 
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input 
                          id="email"
                          type="email" 
                          placeholder="Enter your email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}      
                  /> 
                </div>
                <div className="grid gap-3">
                  <FormField 
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                {...field}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showPassword ? (
                                    <EyeIcon className="w-4 h-4" />
                                ) : (
                                    <EyeOffIcon className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}      
                  /> 
                  <div className="flex justify-end text-xs">
                    <Link href="/forgot-password" className="text-muted-foreground hover:text-primary underline underline-offset-4">
                        Forgot password?
                    </Link>
                  </div>
                </div>
                {!!error && (
                <Alert className="bg-destructive/10 border-none">
                  <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
                )}
                <Button disabled={pending} type="submit" className="w-full">
                  Sign In
                </Button>
                <div className="after:boarder-boarder relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="flex justify-center">
                  <Button disabled={pending} onClick={() => onSocial( "google")} variant={"outline"} type="button" className="w-full">
                    <FaGoogle/>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up" className="underline underline-offset-4">
                    Sign Up
                  </Link>
                </div>
              </div>
            </form> 
          </Form>

          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="./phoenixopia.png" alt="Image" className="h-[92px] w-[92px]"/>
            <p className="text-2x1 font-semibold text-white">Phoenix Auth</p>
          </div>
          
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a> and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>.
      </div>
    </div>
    );
};