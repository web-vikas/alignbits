"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

// Define the validation schema using Zod
const formSchema = z.object({
  checkIn: z.date({
    required_error: "Check-in date is required.",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required.",
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
  signature: z.string().min(2, {
    message: "Signature must be at least 2 characters.",
  }),
});

export default function BookingConfirmation() {
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") ?? "";
  const userId = searchParams.get("userId") ?? "";
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      termsAccepted: false,
      signature: "",
    },
  });

  // Fetch room and user data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch room data
        const roomResponse = await fetch(`/api/rooms/${roomId}`);
        if (!roomResponse.ok) {
          throw new Error("Failed to fetch room data");
        }
        const roomData = await roomResponse.json();
        setRoom(roomData);

        // Fetch user data
        const userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [roomId, userId]);

  // function onSubmit(values) {
  //   console.log(values);
  //   setShowThankYou(true);
  // }

  async function onSubmit(values) {
    try {
      const response = await fetch(`/api/bookings/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          room_id: roomId,
          checkin_date: values.checkIn.toISOString(),
          checkout_date: values.checkOut.toISOString(),
          signature_date: new Date().toISOString(),
          // Include these if you have them in your form or user data
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      const result = await response.json();
      console.log(result);
      setShowThankYou(true);
      toast({
        title: "Success",
        description: "Your booking has been confirmed.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to confirm booking. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return    <Suspense><div className="text-center p-8">Loading...</div></Suspense>;
  }

  if (error) {
    return  <Suspense><div className="text-center p-8">Error: {error}</div></Suspense> ;
  }

  return (
    <Suspense>
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Booking Confirmation</CardTitle>
          <CardDescription>
            Please review your booking details and confirm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {room && (
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={room.image}
                  alt={`Room: ${room.room_name}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm font-medium">
                  {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
                </p>
              </div>
              <div>
                <Label>Room Number</Label>
                <p className="text-sm font-medium">
                  {room ? room.room_name : "Loading..."}
                </p>
              </div>
              <div>
                <Label>Room Type</Label>
                <p className="text-sm font-medium">
                  {room ? room.bed_size : "Loading..."}
                </p>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Check-in Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date().setHours(0, 0, 0, 0) ||
                                date <= new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="checkOut"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Check-out Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date <= form.getValues("checkIn") ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I accept the terms and conditions
                          </FormLabel>
                          <FormDescription>
                            You agree to our Terms of Service and Privacy
                            Policy.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="signature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signature</FormLabel>
                        <FormControl>
                          <Input placeholder="Type your full name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Please type your full name as your digital signature.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Confirm Booking
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showThankYou} onOpenChange={setShowThankYou} modal>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">
              Thank You for Your Booking!
            </DialogTitle>
            <DialogDescription>
              Your reservation has been confirmed. We look forward to welcoming
              you soon.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              setShowThankYou(false);
              router.push("/customerInformation");
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
    </Suspense>
  );
}
