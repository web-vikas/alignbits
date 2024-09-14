"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function RoomSelection({ params }) {
  const searchParams = useSearchParams();
  const user = searchParams.get("id") ?? "NA";
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch("/api/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load room data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchRooms();
  }, [toast]);

  const handelRedirect = (roomId) => {
    router.push(`/bookingConfirmation?roomId=${roomId}&userId=${user}`);
  };

  if (isLoading) {
    return (
      <Suspense>
        <div className="text-center p-8">Loading rooms...</div>{" "}
      </Suspense>
    );
  }

  if (error) {
    return (
      <Suspense>
        <div className="text-center p-8">Error: {error}</div>
      </Suspense>
    );
  }

  return (
    <Suspense>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Our Hotel
            </h1>
            <p className="text-xl text-gray-600">
              Choose from our selection of comfortable rooms
            </p>
          </header>
          <Suspense>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.room_id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle>{room.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="secondary" className="mt-2">
                        {room.bed_size} Bed
                      </Badge>
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
                    <Button onClick={() => handelRedirect(room?.room_id)}>
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    </Suspense>
  );
}
