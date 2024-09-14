import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextResponse } from "next/server";

// Initialize database connection
async function openDb() {
  try {
    return await open({
      filename: "./mydb.sqlite",
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Unable to connect to database");
  }
}

// GET all rooms that are not currently booked today
export async function GET() {
  let db;
  try {
    db = await openDb();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Query to get rooms that are not booked today
    const rooms = await db.all(`
  SELECT * FROM rooms 
      `);
    // LEFT JOIN user_booking b ON r.room_id = b.room_id
    // AND (b.checkout_date > date())
    // WHERE b.room_id IS NULL

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    if (db) await db.close();
  }
}

// POST a new room
export async function POST(request) {
  let db;
  try {
    const { room_name, image } = await request.json();
    if (!room_name) {
      return NextResponse.json(
        { message: "Room name is required" },
        { status: 400 }
      );
    }

    db = await openDb();
    const result = await db.run(
      "INSERT INTO rooms (room_name, image) VALUES (?, ?)",
      [room_name, image || null]
    );

    return NextResponse.json({ room_id: result.lastID }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    if (db) await db.close();
  }
}
