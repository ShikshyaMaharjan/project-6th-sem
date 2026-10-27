# Culture Nepal - setup and what changed

## Run the backend (from the Backend folder)

    python -m venv venv
    venv\Scripts\activate          (Windows)   or   source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload

Tables are created automatically on startup. This update adds three NEW
tables (favorites, reviews, rentals). No existing table was altered, so no
ALTER TABLE is needed.

Optional: set DATABASE_URL to use another database (default is your existing
local PostgreSQL URL in database.py).

## Load / refresh cultural data (safe to run again)

    python seed_cultural.py
    python fetch_commons_images.py     (needs internet; then run seed_cultural.py again)

`seed_cultural.py`:
- keeps your 15 original items and converts their old bare image names
  (e.g. "yomari.jpg") to /media/cultural/... paths
- adds Dhikri (Tharu), Sel Roti and Gundruk (Gurung), Khapse and Dhido (Tamang)
- adds Haku Tapli (Newar cap), Tharu Waist Chain, Tharu Broad Wrist Band (photos cropped from your dress dataset, in Backend/media/cultural/) and Tamang / Tharu traditional attire (no photo yet)
- never creates duplicates (slug is unique)

## Run the frontend

    npm install
    npm run dev

## What changed (summary)

Backend
- /cultural/ supports ?category= &community= &q= &limit= &offset=, plus /cultural/meta/filters
- /media serves Backend/media (cultural images and uploaded contribution images)
- POST /contributions/upload (JPG/PNG/WEBP, 5 MB)
- approving a contribution now creates a cultural_contents record
- NEW routes: /favorites, /reviews, /rentals

Frontend
- PostgreSQL is now the single source of truth: Explore, Cultural detail,
  Home search and the User dashboard all read /cultural/
  (src/data/culturalData.js is no longer used and can be deleted)
- src/config.js: shared API_URL, image URL helper, logged-in user helper
- Explore: community filter and favorite hearts
- Cultural detail: favorite button, reviews, Traditional Attire rental request
- New pages: /favorites and /my-rentals
- Admin: working Favorites screen and a new Rentals screen
- User: contribution image upload (the URL field still works)
- Events: images from URLs or /media paths are shown
- Navbar shows Dashboard/Logout when logged in
- /admin and /user redirect visitors without the right role

## Security (login tokens and roles)

- /auth/login and /auth/register now also return a signed `token`
  (valid 12 hours). `src/config.js` sends it automatically on every call to
  the backend, so no page had to be rewritten.
- Backend rules (Backend/auth_utils.py):
  - visitors: read cultural content, approved events and approved contributions
  - logged-in users: only their OWN favorites, reviews, rentals,
    contributions and notifications (user_id sent by the browser is checked
    against the token)
  - organizations: create events, see and delete only their own events
  - admin: everything else (approve/reject, users, organizations, cultural
    content edit/delete, rentals, favorites stats, debug endpoints)
- Everyone must log in again once after this update (old saved logins have no
  token and are sent to the Login page).
- For real use set a long random SECRET_KEY environment variable before
  starting the backend, for example:
      SECRET_KEY=some-long-random-text uvicorn main:app --reload
  and use HTTPS when you deploy. Admin accounts are still created with
  create_admin.py (admins cannot register from the website).

## Known limits / not done

- Changkol is not added (no Tamang source found).
- Dhido is listed under Tamang as you requested; sources I found describe it
  as eaten across Nepal (and as a Gurung staple). Edit it in Admin if needed.
- Tamang/Gurung/Rai/Tharu attire and ornaments are not added: the Kaggle
  dress photos show real people and their license is unconfirmed.
- Rai has no entries yet.
- Image credits: see IMAGE_CREDITS.md and confirm authors/licenses first.
