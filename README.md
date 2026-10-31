# For Amma, With All My Love — Birthday Surprise Website

A responsive birthday surprise website dedicated to Amma, with a cinematic opening, family photos, heartfelt quotes, a memory gallery, birthday letter, animated cake, candle wish, petals and confetti.

## Included in this ZIP
- Frontend: HTML, CSS and vanilla JavaScript
- Backend: Node.js + Express API
- Your uploaded family photos and birthday tribute poster
- The uploaded VALIMAI mother song at `public/assets/birthday-song.mp3`
- Audio is configured to start when the visitor taps **Open your surprise** and loop while the page remains open
- Admin editor at `/admin.html` and editable content in `data/content.json`

## Run locally
1. Install Node.js LTS from https://nodejs.org/.
2. Extract the ZIP.
3. Open a terminal in the `Amma_Birthday_Surprise` folder.
4. Run `npm install` and then `npm start`.
5. Open http://localhost:3000.

## Music behavior
Browsers generally block audio autoplay until the visitor interacts with the page. The song starts from the opening-button click and is set to loop. It continues while the visitor browses the page until they close the page or pause the music.

## Personalize it
- Update quotes and memory captions in `data/content.json`.
- Open `http://localhost:3000/admin.html` to use the content editor.
- Replace an image in `public/assets/` while keeping its filename if you want to change the displayed photo.

## Backend API
- `GET /api/content` — read birthday content
- `PUT /api/content` — update birthday content
- `POST /api/message` — save a guest message
- `GET /api/messages` — read saved messages

For public deployment, configure `ADMIN_TOKEN` on the server and use persistent storage for `data/` if the host filesystem is ephemeral. Deploy to a Node.js hosting service that supports Express. The project is not deployed publicly by this ZIP.
