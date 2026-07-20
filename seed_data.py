import sqlite3
from datetime import datetime, timezone
import json

def seed():
    conn = sqlite3.connect('twinfusion.db')
    cur = conn.cursor()

    # Get the user ID of starun
    cur.execute("SELECT id FROM users WHERE username = 'starun'")
    user = cur.fetchone()
    if not user:
        print("User starun not found. Please register in the frontend first.")
        return
    user_id = user[0]

    # Delete existing mock sensors/data to avoid duplicates
    cur.execute("DELETE FROM sensor_data")
    cur.execute("DELETE FROM sensors")

    # Insert Timetable Sensor
    cur.execute("""
        INSERT INTO sensors (user_id, name, sensor_type, description, location, sensor_metadata, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        "CS Timetable Sensor",
        "academic_timetable",
        "Tracks daily classroom slots and room locations",
        "Block-II CSE",
        json.dumps({"building": "Tech Block"}),
        True,
        datetime.now(timezone.utc).isoformat()
    ))
    timetable_sensor_id = cur.lastrowid

    # Insert Preferences Sensor
    cur.execute("""
        INSERT INTO sensors (user_id, name, sensor_type, description, location, sensor_metadata, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        "Student Preferences Sensor",
        "student_preferences",
        "Tracks onboarding choices and coding interests",
        "Onboarding Wizard",
        json.dumps({"app_version": "1.0.0"}),
        True,
        datetime.now(timezone.utc).isoformat()
    ))
    pref_sensor_id = cur.lastrowid

    # Insert Timetable Sensor Data
    cur.execute("""
        INSERT INTO sensor_data (sensor_id, timestamp, raw_data, quality_score)
        VALUES (?, ?, ?, ?)
    """, (
        timetable_sensor_id,
        datetime.now(timezone.utc).isoformat(),
        json.dumps({
            "department": "Computer Science",
            "semester": 1,
            "classes": [
                {"subject": "Python Coding Lab", "time": "10:00 AM - 12:00 PM", "room": "Lab 3"},
                {"subject": "Engineering Mathematics", "time": "2:00 PM - 3:30 PM", "room": "Room 204"}
            ],
            "free_blocks": [
                {"time": "12:00 PM - 2:00 PM", "duration_hours": 2}
            ]
        }),
        1.0
    ))

    # Insert Preferences Sensor Data
    cur.execute("""
        INSERT INTO sensor_data (sensor_id, timestamp, raw_data, quality_score)
        VALUES (?, ?, ?, ?)
    """, (
        pref_sensor_id,
        datetime.now(timezone.utc).isoformat(),
        json.dumps({
            "full_name": "S Tarun",
            "interests": ["AI", "Web Development", "Python"],
            "hackathon_goal": "Win the Google Student Hackathon",
            "club_ambitions": "Join the Google Developer Student Club (GDSC)"
        }),
        1.0
    ))

    conn.commit()
    conn.close()
    print(f"Successfully seeded database sensors for user_id={user_id}!")
    print(f"Timetable Sensor ID: {timetable_sensor_id}")
    print(f"Preferences Sensor ID: {pref_sensor_id}")

if __name__ == '__main__':
    seed()
