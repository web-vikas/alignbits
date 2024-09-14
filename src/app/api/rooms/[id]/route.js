import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { NextResponse } from 'next/server';

// Initialize database connection
async function openDb() {
  try {
    return await open({
      filename: './mydb.sqlite',
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Unable to connect to database');
  }
}

// GET rooms by user ID
export async function GET(request, { params }) {
  const { id } = params;
  
  let db;
  try {
    db = await openDb();
    // Query to get rooms for a specific user
    const rooms = await db.all(`
      SELECT *
      FROM rooms
      WHERE room_id = ?
    `, [id]);
    
    return NextResponse.json(rooms[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}