"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Import useRouter

// Define the validation schema using Zod
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  otp: z.string().min(1, {
    message: "OTP must be exactly 6 digits.",
  }),
});

export default function CustomerInformation() {
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      otp: "",
    },
  });

  // Handle form submission
  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      // Send a POST request to your API to create a new user
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      // Get the newly created user's ID
      const { id } = await response.json();

      // Redirect to the booking confirmation page with the customer ID
      router.push(`/roomSelection?id=${id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          "There was an error submitting the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Please enter your details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="!w-full justify-center">
                    <FormLabel>OTP</FormLabel>
                    <FormControl className="!w-full justify-center">
                      <InputOTP
                        maxLength={6}
                        {...field}
                        className="!w-full justify-center"
                      >
                        <InputOTPGroup className="!w-full justify-center">
                          <InputOTPSlot
                            index={0}
                            className="!w-full justify-center"
                          />
                          <InputOTPSlot
                            index={1}
                            className="!w-full justify-center"
                          />
                          <InputOTPSlot
                            index={2}
                            className="!w-full justify-center"
                          />
                          <InputOTPSlot
                            index={3}
                            className="!w-full justify-center"
                          />
                          <InputOTPSlot
                            index={4}
                            className="!w-full justify-center"
                          />
                          <InputOTPSlot
                            index={5}
                            className="!w-full justify-center"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Enter the 6-digit OTP sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
