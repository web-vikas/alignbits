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

// GET all users
export async function GET() {
  let db;
  try {
    db = await openDb();
    const users = await db.all("SELECT * FROM users");
    return NextResponse.json(users, { status: 200 });
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

// POST a new user
export async function POST(request) {
  let db;
  try {
    const { firstName, lastName, email } = await request.json();
    if (!firstName || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    db = await openDb();
    const result = await db.run(
      "INSERT INTO user_booking (first_name,last_name, email) VALUES (?, ? , ?)",
      [firstName, lastName, email]
    );
    return NextResponse.json({ id: result.lastID }, { status: 201 });
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

// PUT update user info
export async function PUT(request) {
  let db;
  try {
    const { id, name, email } = await request.json();
    if (!id || !name || !email) {
      return NextResponse.json(
        { message: "ID, name, and email are required" },
        { status: 400 }
      );
    }

    db = await openDb();
    const result = await db.run(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );
    if (result.changes === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    if (db) await db.close();
  }
}