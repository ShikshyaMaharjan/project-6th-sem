from pathlib import Path

from database import SessionLocal, engine, Base
from models.cultural import CulturalContent

# Make sure the table exists (safe to run if it already does)
Base.metadata.create_all(bind=engine)

MEDIA_CULTURAL_DIR = Path(__file__).resolve().parent / "media" / "cultural"


def image_for(slug):
    """
    Images live in Backend/media/cultural/<slug>.jpg (or .png / .webp)
    and are served by FastAPI at /media/cultural/<file>.
    If no file exists yet, the item is saved with no image
    (Explore shows its normal "No image available" box).
    """
    for extension in (".jpg", ".jpeg", ".png", ".webp"):
        if (MEDIA_CULTURAL_DIR / f"{slug}{extension}").exists():
            return f"/media/cultural/{slug}{extension}"

    return None


cultural_items = [
    {
        "slug": "patan-durbar-square",
        "title": "Patan Durbar Square",
        "category": "Heritage Sites",
        "community": "Newar",
        "location": "Lalitpur, Nepal",
        "image": "patan-durbar-square.jpg",
        "description": "A historic cultural site known for its traditional Newari architecture and artistic heritage.",
        "significance": "The site represents the rich architectural and artistic traditions of the Kathmandu Valley and remains an important place for cultural and religious activities.",
    },
    {
        "slug": "bhaktapur-durbar-square",
        "title": "Bhaktapur Durbar Square",
        "category": "Heritage Sites",
        "community": "Newar",
        "location": "Bhaktapur, Nepal",
        "image": "bhaktapur-durbar-square.jpg",
        "description": "A historic square known for its traditional architecture, temples, courtyards, and artistic craftsmanship.",
        "significance": "Bhaktapur Durbar Square reflects the historical architecture and artistic traditions of the Kathmandu Valley.",
    },
    {
        "slug": "kathmandu-durbar-square",
        "title": "Kathmandu Durbar Square",
        "category": "Heritage Sites",
        "community": "Newar",
        "location": "Kathmandu, Nepal",
        "image": "kathmandu-durbar-square.jpg",
        "description": "A historic urban square containing temples, palaces, courtyards, and traditional architectural structures.",
        "significance": "The square represents an important part of Kathmandu's historical, architectural, religious, and cultural landscape.",
    },
    {
        "slug": "yomari",
        "title": "Yomari",
        "category": "Food & Recipes",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "yomari.jpg",
        "description": "A traditional Newari steamed delicacy made from rice flour and commonly filled with sweet fillings.",
        "significance": "Yomari is especially associated with Yomari Punhi and represents an important part of Newar food traditions.",
    },
    {
        "slug": "bara",
        "title": "Bara",
        "category": "Food & Recipes",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "bara.jpg",
        "description": "A traditional Newari savory pancake commonly prepared from lentil batter and enjoyed as part of Newari cuisine.",
        "significance": "Bara is an important example of traditional Newari food and is commonly enjoyed during family and community gatherings.",
    },
    {
        "slug": "chatamari",
        "title": "Chatamari",
        "category": "Food & Recipes",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "chatamari.jpg",
        "description": "A traditional Newari rice-flour dish often described as a savory rice-flour crepe with different toppings.",
        "significance": "Chatamari represents the distinctive food traditions of the Newar community and remains popular in the Kathmandu Valley.",
    },
    {
        "slug": "indra-jatra",
        "title": "Indra Jatra",
        "category": "Festivals",
        "community": "Newar",
        "location": "Kathmandu, Nepal",
        "image": "indra-jatra.jpg",
        "description": "A major Kathmandu festival featuring traditional rituals, chariot processions, masked dances, and community celebrations.",
        "significance": "The festival brings together religious practices, traditional performances, and community participation in historic areas of Kathmandu.",
    },
    {
        "slug": "bisket-jatra",
        "title": "Bisket Jatra",
        "category": "Festivals",
        "community": "Newar",
        "location": "Bhaktapur, Nepal",
        "image": "bisket-jatra.jpg",
        "description": "A major annual festival in Bhaktapur featuring traditional processions, chariot pulling, rituals, and community celebrations.",
        "significance": "Bisket Jatra is an important festival that demonstrates the living traditions and community participation of Bhaktapur.",
    },
    {
        "slug": "gai-jatra",
        "title": "Gai Jatra",
        "category": "Festivals",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "gai-jatra.jpg",
        "description": "A traditional festival involving processions, performances, and community gatherings held in remembrance of deceased family members.",
        "significance": "Gai Jatra combines remembrance, community participation, traditional performances, and cultural expression.",
    },
    {
        "slug": "haku-patasi",
        "title": "Haku Patasi",
        "category": "Traditional Attire",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "haku-patasi.jpg",
        "description": "A traditional black sari with a red border associated with Newar women of the Kathmandu Valley.",
        "significance": "Haku Patasi is an important expression of Newar identity and continues to be worn during festivals, cultural events, and traditional occasions.",
    },
    {
        "slug": "tapalan",
        "title": "Tapalan",
        "category": "Traditional Attire",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "tapalan.jpg",
        "description": "A traditional long shirt worn as part of men's Newar attire, commonly paired with traditional trousers.",
        "significance": "Tapalan remains an important element of traditional Newar clothing and is especially visible during cultural events and festivals.",
    },
    {
        "slug": "bhanta",
        "title": "Bhantanlan",
        "category": "Traditional Attire",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "bhanta.jpg",
        "description": "A traditional ankle-length garment associated with the clothing of Newar girls.",
        "significance": "Bhantanlan represents one of the traditional forms of Newar clothing and contributes to the diversity of traditional attire in the Kathmandu Valley.",
    },
    {
        "slug": "lusuwya",
        "title": "Lusuwya",
        "category": "Jewelry",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "lusuwya.jpg",
        "description": "A traditional Newa jewelry ornament associated with traditional adornment and ceremonial dress.",
        "significance": "Traditional jewelry forms an important part of Newa ceremonial attire and reflects craftsmanship, identity, and cultural expression.",
    },
    {
        "slug": "nyapu-sikha",
        "title": "Nyapu Sikha",
        "category": "Jewelry",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "Nyapu-Sikha.jpg",
        "description": "A traditional Newa head ornament worn by women as part of traditional jewelry and ceremonial adornment.",
        "significance": "Nyapu Sikha is an important traditional ornament commonly associated with Newa women's attire and cultural occasions.",
    },
    {
        "slug": "tayo",
        "title": "Tayo",
        "category": "Jewelry",
        "community": "Newar",
        "location": "Kathmandu Valley, Nepal",
        "image": "tayo.jpg",
        "description": "A traditional Newa necklace with cultural and religious significance.",
        "significance": "Tayo is an important Newa jewelry piece associated with traditional dress, special occasions, and cultural symbolism.",
    },

    # =====================================================
    # NEW FOOD ITEMS
    # Descriptions only repeat facts found in the sources listed
    # in Backend/media/ATTRIBUTION.md. Location / significance are
    # left empty until a source is available.
    # =====================================================
    {
        "slug": "dhikri",
        "title": "Dhikri",
        "category": "Food & Recipes",
        "community": "Tharu",
        "location": None,
        "image": None,
        "description": "A steamed rice-flour dish prepared mainly by the Tharu people of southern Nepal. A dough of rice flour and warm water is shaped and steamed, then eaten with chutney or curry.",
        "significance": "Dhikri is an essential food for the Maghi festival and is also served at Dashain and Chhath.",
    },
    {
        "slug": "sel-roti",
        "title": "Sel Roti",
        "category": "Food & Recipes",
        "community": "Gurung",
        "location": None,
        "image": None,
        "description": "A sweet, ring-shaped bread made from rice flour and deep-fried. It is a traditional festival food eaten in many Nepali communities, and is listed among the foods of Tamu Losar, the Gurung new year.",
        "significance": "Sel roti is made for festivals such as Dashain and Tihar and is also served during Losar celebrations.",
    },
    {
        "slug": "gundruk",
        "title": "Gundruk",
        "category": "Food & Recipes",
        "community": "Gurung",
        "location": None,
        "image": None,
        "description": "Fermented and dried leafy greens, eaten as a pickle or cooked into soups and curries. Sources describe it as an essential item in Gurung households; it is also eaten widely across Nepal.",
        "significance": "Gundruk is the traditional side dish for dhido and is made in many households throughout the year.",
    },
    {
        "slug": "khapse",
        "title": "Khapse",
        "category": "Food & Recipes",
        "community": "Tamang",
        "location": None,
        "image": None,
        "description": "A deep-fried pastry made from dough flavoured with sugar, butter and milk, shaped in twists and other forms. It is made for Losar and is also eaten by Sherpa, Gurung and Hyolmo communities.",
        "significance": "Khapse is prepared for Sonam Losar, the Tamang new year, and offered to the lama during rituals.",
    },
    {
        "slug": "dhido",
        "title": "Dhido",
        "category": "Food & Recipes",
        "community": "Tamang",
        "location": None,
        "image": None,
        "description": "A thick porridge made by stirring buckwheat or millet flour into boiling water. It is a traditional staple eaten across Nepal and is usually served with gundruk, lentils or curries.",
        "significance": None,
    },
    {
        "slug": "haku-tapli",
        "title": "Haku Tapli",
        "category": "Traditional Attire",
        "community": "Newar",
        "location": "Kathmandu Valley",
        "image": None,
        "description": "A black cap worn by Newar men as part of traditional dress. The black cap known as the Bhadgaule topi is made in Bhaktapur and is also worn as part of Nepal's national dress for men.",
        "significance": "Newar men in the Kathmandu Valley who attend festivals in traditional dress wear it, and a cultural expert from Bhaktapur calls it a must for that outfit.",
    },
    {
        "slug": "tharu-waist-chain",
        "title": "Tharu Waist Chain",
        "category": "Jewelry",
        "community": "Tharu",
        "location": "Terai, Nepal",
        "image": None,
        "description": "A silver chain worn around the waist by Tharu women. Among Rana Tharu women of Kailali and Kanchanpur it is called kaindhani.",
        "significance": "Rana Tharu silver ornaments were worn at weddings, festivals, worship, dances and other special occasions, and were linked to social prestige, economic status and cultural identity.",
    },
    {
        "slug": "tharu-wrist-band",
        "title": "Tharu Broad Wrist Band",
        "category": "Jewelry",
        "community": "Tharu",
        "location": "Terai, Nepal",
        "image": None,
        "description": "A broad silver band worn on the wrist by Tharu women. Traditional Tharu arm and wrist jewellery includes baju, banka and bijayat on the arms and legarahi on the wrist.",
        "significance": "Apart from the nose, ear and finger pieces, traditional Tharu women's jewellery is made of silver.",
    },
    {
        "slug": "tamang-traditional-attire",
        "title": "Tamang Traditional Attire",
        "category": "Traditional Attire",
        "community": "Tamang",
        "location": None,
        "image": None,
        "description": "Tamang women wear a black or red blouse with a blue and red sari that has horizontal patterns and a yellow patuka. Both men and women wear a distinctive cap made of wool.",
        "significance": None,
    },
    {
        "slug": "tharu-traditional-attire",
        "title": "Tharu Traditional Attire",
        "category": "Traditional Attire",
        "community": "Tharu",
        "location": "Terai, Nepal",
        "image": None,
        "description": "Tharu women traditionally wear a cholia, a blouse usually black in colour, with a nahagi (a white cloth worn up to the knee) and an uporona wrapped around the chest. Tharu men mainly wear a mardani, a dhoti and a phad.",
        "significance": None,
    },
]


db = SessionLocal()

try:
    added = 0
    skipped = 0

    for item in cultural_items:
        existing_item = db.query(CulturalContent).filter(
            CulturalContent.slug == item["slug"]
        ).first()

        image = image_for(item["slug"])

        if existing_item:
            # Old rows store a bare file name such as "yomari.jpg".
            # Convert it to the /media path when the file is available.
            old_image = existing_item.image or ""
            is_old_style = (
                old_image == ""
                or not (
                    old_image.startswith("/")
                    or old_image.startswith("http")
                )
            )

            if image and is_old_style:
                existing_item.image = image
                print(f"Updated image: {item['title']} -> {image}")
            else:
                print(f"Skipped: {item['title']} (already exists)")

            skipped += 1
            continue

        new_item = CulturalContent(
            title=item["title"],
            slug=item["slug"],
            category=item["category"],
            community=item["community"],
            location=item["location"],
            description=item["description"],
            significance=item["significance"],
            image=image,
        )

        db.add(new_item)
        added += 1

    db.commit()

    print()
    print("Cultural data seeding completed!")
    print(f"Added: {added}")
    print(f"Skipped: {skipped}")

finally:
    db.close()