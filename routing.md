//plan logic

//mai actualizam pe parcurs fisierul-doar ca idee

# Routing Plan – Bug Tracker Project

## Frontend

- `/login` → Pagina de autentificare (email + parolă)
- `/register` → Creare cont nou
- `/dashboard` → Pagina principală cu lista proiectelor
- `/project/:id` → Detalii despre un proiect (bug-urile raportate, echipa)
- `/add-bug` → Formular pentru adăugarea unui bug nou
- `/bug/:id` → Detalii despre un bug (descriere, status, prioritate)
- `/profile` → Profilul utilizatorului (opțional)

## Backend (API – Node.js)

- `POST /api/auth/register` – înregistrează un utilizator nou
- `POST /api/auth/login` – autentificare utilizator
- `GET /api/projects` – obține toate proiectele
- `POST /api/projects` – adaugă un proiect nou
- `GET /api/projects/:id` – detalii despre un proiect
- `GET /api/projects/:id/bugs` – obține bug-urile asociate unui proiect
- `POST /api/bugs` – adaugă un bug nou
- `PATCH /api/bugs/:id/status` – actualizează statusul unui bug
