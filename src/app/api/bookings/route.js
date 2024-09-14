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

// PUT update booking info
export async function PUT(request) {
  let db;
  try {
    const { id, room_id, checkin_date, checkout_date, signature_date } = await request.json();
    if (!id || !room_id || !checkin_date || !checkout_date) {
      return NextResponse.json({ message: 'ID, room ID, check-in date, and check-out date are required' }, { status: 400 });
    }

    db = await openDb();
    const result = await db.run(
      `UPDATE user_booking
       SET room_id = ?, checkin_date = ?, checkout_date = ?, signature_date = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [room_id, checkin_date, checkout_date, signature_date, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Booking updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}
