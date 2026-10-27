from database import SessionLocal
from models.event import Event


events = [
    {
        "slug": "indra-jatra-celebration",
        "title": "Indra Jatra Celebration",
        "type": "Festival",
        "date": "September 25, 2026",
        "time": "10:00 AM",
        "location": "Kathmandu Durbar Square",
        "description": "Experience traditional processions, chariot celebrations, rituals, music, and cultural performances during one of Kathmandu's major festivals.",
        "about": "Indra Jatra is one of the major traditional celebrations of Kathmandu. The festival brings together processions, rituals, music, chariot traditions, and community participation.",
        "image": "indra-jatra.jpg",
    },
    {
        "slug": "grand-dhimey-dance",
        "title": "Grand Dhimey Dance",
        "type": "Cultural Performance",
        "date": "September 23, 2026",
        "time": "10:00 AM",
        "location": "Basantapur",
        "description": "Experience a grand Dhimey dance performance featuring more than a hundred dancers coming together with traditional Dhimey Baja.",
        "about": "Grand Dhimey Dance brings the community together through traditional music and dance. More than a hundred dancers participate in the performance, accompanied by Dhimey Baja and traditional flute dance, creating a lively celebration for people of different generations.",
        "image": None,
    },
    {
        "slug": "newari-art-craft-exhibition",
        "title": "Newari Art & Craft Exhibition",
        "type": "Exhibition",
        "date": "September 20, 2026",
        "time": "11:00 AM",
        "location": "Bhaktapur",
        "description": "Explore traditional Newari artwork, handicrafts, paintings, and cultural creations from local artists and craftspeople.",
        "about": "The exhibition brings together traditional Newari artwork and craftsmanship, providing visitors with an opportunity to explore the creativity and skills of local artists and craftspeople.",
        "image": None,
    },
]


db = SessionLocal()

try:
    added = 0
    skipped = 0

    for item in events:
        existing_event = db.query(Event).filter(
            Event.slug == item["slug"]
        ).first()

        if existing_event:
            print(f"Skipped: {item['title']} (already exists)")
            skipped += 1
            continue

        new_event = Event(
            slug=item["slug"],
            title=item["title"],
            type=item["type"],
            date=item["date"],
            time=item["time"],
            location=item["location"],
            description=item["description"],
            about=item["about"],
            image=item["image"],
        )

        db.add(new_event)
        added += 1

    db.commit()

    print()
    print("Event data seeding completed!")
    print(f"Added: {added}")
    print(f"Skipped: {skipped}")

finally:
    db.close()