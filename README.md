# 🐞 Bug Tracker – Aplicație Web pentru gestionarea bug-urilor

-> Descriere:

_Bug Tracker_ este o aplicație web destinată echipelor care vor să urmărească și să gestioneze erorile apărute în timpul dezvoltării unui proiect software.  
 Utilizatorii pot crea proiecte, raporta bug-uri, adăuga comentarii, primi notificări și acumula puncte de experiență (XP) în funcție de activitatea lor.

---

-> Stack Tehnologic:

- _Backend:_ Node.js, Express, Prisma ORM, PostgreSQL
- _Frontend:_ React.js
- _Altele:_ JWT, CORS, Dotenv, GitHub API

---

-> Documentație:

[routing.md](./routing.md) → Planul rutelor frontend și backend  
[database-schema.md](./database-schema.md) → Modelul bazei de date și relațiile  
[wireframes.md](./wireframes.md) → Wireframes și structura vizuală a aplicației  
[design-system.md](./design-system.md) → Elemente de design și iconografie utilizată

---

-> Funcționalități principale:

- Înregistrare și autentificare utilizatori
- Creare și administrare proiecte
- Raportare, filtrare și rezolvare bug-uri
- Comentarii și istoric de statusuri
- Sistem XP & Level pentru gamificare
- Notificări în timp real pentru acțiuni importante

---

## 🚀 Instalare și rulare

-> Acești pași permit configurarea și pornirea serverului backend pe un mediu local

1. Instalarea dependențelor 

 - Instalează toate pachetele necesare proiectului (Express, Prisma, JWT, CORS și restul librăriilor esențiale)

```
npm install 
```
2. Configurarea variabilelor 

 - În folderul `back-end` creați un fișier `.env` , care conține datele de conectare la BD și de configurare a serverului, conform structurii: 

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/bugtracker?schema=public"
PORT=3000 
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET="introduceti_un_cod_secret"
```
- variabilele `USERNAME` și `PASSWORD` trebuie înlocuite cu datele date de PostgreSQL pe dispozitivul local

3. Aplicarea migrărilor PRISMA

- Rulați pentru a genera structura completă a BD : 

```
npx prisma migrate dev
```

4. Pornirea serverului în modul development

- Pornirea serverului Node.js : 

```
npm run dev
```

-> după acești pași, serverul ruleaza la `http://localhost:3000`


---

## 🧪 Testarea API-ului in POSTMAN

-> Pentru a testa backend-ul manual trebuie să executați următorii pași:

- Toate rutele backend-ului încep cu:
```
http://localhost:3000/api
```

- Rularea `POST /api/auth/login` duce la obținerea token-ului JWT folosit în rutele protejate

- Pentru a accesa rutele protejate se vor folosi următoarele în `HEADER`:
```
Key : Authorization
Value: Bearer <token_JWT>
```