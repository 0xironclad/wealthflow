"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"

// import { Eye, EyeOff } from "lucide-react";
import { signUpSchema } from "@/lib/auth-schema";
import { signup } from "../login/actions";


const formSchema = signUpSchema;

function SignUpPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
    const { toast } = useToast();


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formData = new FormData()
            formData.append('email', values.email)
            formData.append('password', values.password)
            formData.append('name', values.name)

            const result = await signup(formData)

            if (result?.success) {
                toast({
                    title: "Account created successfully!",
                    description: "Please check your email and click the confirmation link to activate your account."
                })
                form.reset();
            } else if (result?.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error("Error creating account:", error)
            toast({
                title: "Error",
                description: "Error creating account. Please try again.",
                variant: "destructive"
            })
        }
    }

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create an account to continue</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@gmail.com" {...field} />
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
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Sign Up</Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p className="text-muted-foreground text-sm">
                    Already have an account?
                    <Link href="/login" className="text-primary hover:underline" prefetch={true}>
                        Sign In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}


export default SignUpPage;
