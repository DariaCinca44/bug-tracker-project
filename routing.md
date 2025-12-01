## Frontend

## 🔐 Autentificare

- `/login` → Pagina de autentificare (email + parolă).

- `/register` → Pagina de creare cont.

## 🏠 Pagini generale

- `/dashboard` → Pagina principală care afișează proiectele utilizatorului (MP/TST)

- `/profile` → Pagina de profil (nume, email, XP, level, proiecte, bug-uri asignate).

## 🧩 Proiecte

- `/project/:id` → Pagina unui proiect: listă bug-uri + echipa + butoane de acțiuni.

- `/project/:id/add-bug` → Formular pentru raportarea unui bug într-un proiect.

## 🐞 Bug-uri

- `/bug/:id` → Pagina unui bug, cu: detalii bug , status , severitate ,prioritate, link commit, buton „Asignează-mi mie” (MP)

## Urmează să fie implementate

## 📝 Comentarii la bug-uri

- sistem UI de comentarii , form pentru scriere comentariu, listă comentarii sub bug, edit/delete comentariu pentru autor

## 🔔 Notificări

- icon și badge în navbar, dropdown cu notificări, link către bug/proiect, marcarea ca "citită"

## ⭐ Gamificare

- afișarea XP și Level pe profil, progres bar, animații la level up

## 🕒 Istoric statusuri

- timeline vizual sub bug, buline/respective status date în ordine cronologică

## 🔁 Notificări în timp real

- WebSocket / Socket.io, update-uri instant pentru: bug asignat, bug rezolvat, comentariu nou, schimbări de proiect

## Backend

##🔐 Auth

- `POST /api/auth/register` -> creează un utilizator nou pe baza emailului și parolei

- `POST /api/auth/login` -> autentifica utilizatorul și returnează un token JWT

## 👤 Users

- `GET /api/users/me` -> returnează informațiile utilizatorului autentificat

- `PATCH /api/users/me` -> actualizează numele, emailul sau parola utilizatorului

- `DELETE /api/users/me` -> șterge contul utilizatorului autentificat

## 🧩 Projects

- `POST /api/projects` -> creează un proiect nou (userul devine automat MP)

- `POST /api/projects/:id/join` -> permite unui user să se alăture proiectului ca TST

- `PATCH /api/projects/:id` -> permite unui MP să actualizeze detaliile proiectului

- `DELETE /api/projects/:id` -> permite creatorului proiectului să îl steargă

## 🐞 Bugs

- `POST /api/bugs/projects/:projectId/bugs` -> TST raportează un bug nou în cadrul proiectului

- `GET /api/bugs/projects/:projectId/bugs` -> listeaza toate bug-urile asociate proiectului

- `PATCH /api/bugs/:bugId/assign` -> MP își poate aloca rezolvarea unui bug

- `PATCH /api/bugs/:bugId/status` -> MP schimba statusul bugului (ex: OPEN -> IN_PROGRESS -> RESOLVED)

- `PATCH /api/bugs/:bugId` -> permite editarea detaliilor unui bug

## Urmează să fie implementate

## 📝 Comentarii la bug-uri

- `GET /api/bugs/:id/comments` –> returnează comentariile aferente unui bug

- `POST /api/bugs/:id/comments` –> adaugă un comentariu nou

- `PATCH /api/comments/:commentId` → editează comentariul

- `DELETE /api/comments/:commentId` -> șterge comentariul

## 🔔 Notificări

- `GET /api/notifications` –> obține notificările utilizatorului

- `PATCH /api/notifications/:id/read` –> marchează notificarea ca citită

## ⭐ Gamificare (în plan)

- XP automat la raportare/rezolvare

- Calcul level

## Istoric statusuri (în plan)

- Salvarea modificărilor în `BugStatusHistory`

## 🔁 Notificări în timp real

- Integrare Socket.io

- Update-uri live pentru bug-uri / proiecte
