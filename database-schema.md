# Prezentarea modelului de date pentru aplicația de gestionare a bug-urilor

```
[User]
|-< Project         (createdById)
|-< ProjectMember   (userId)
|-< Bug             (reporterId)
|-< Bug             (assignedId)
|-< BugComment      (authorId)
|-< BugStatusHistory(changedById)
|-< Notification    (userId)
|-< XPChangeLog     (userId)

[Project]
|-< ProjectMember   (projectId)
|-< Bug             (projectId)

[Bug]
|-< BugComment       (bugId)
|-< BugStatusHistory (bugId)
```

## Legendă 
- `-<` : reprezentarea relației 1-N


## Descrierea tabelelor din modelul de date
- `User` : reține informațiile legate de contul și profilul utilizatorului, precum email, parolă hashată, nume, prenume, progresul XP
- `Project` : reține nume, descriere, URL-ul repository
- `ProjectMember` : leaga utilizatorii de proiecte cu rolul specific: MP sau TST
- `Bug` : problema identificată într-un proiect, reține titlul, descrierea, severitate, prioritate, status, URL-ul commit-ului
- `BugComment` : reține id-ul bug-ului, id-ul utilizatorului care a scris comentariul, content, data la care s-a postat
- `BugStatusHistory` : ține evidența schimbărilor de status a bug-urilor, reține id-ul bugului, id-ul utilizatorului care a schimbat status-ul, status anterior, status actual
- `Notification` : reține datele notificarilor
- `XPChangeLog` : istoricul modificărilor de XP

## Cardinalitatea modelului de date
- un utilizator poate crea multiple proiecte și poate fi membru în echipa mai multor proiecte(prin 'ProjectMember'), raporta mai multe bug-uri și i se pot asigna bug-uri
- un proiect are mai multe bug-uri și mai multi MP
- fiecare bug are un singur utilizator asignat pentru rezolvare(MP) și un singur reporter(MP sau TST)
- bug-urile au un istoric de status-uri ('BugStatusHistory') și un thread ce conține comentariile ('BugComment')

## Permisiuni in modelul de date

1. **Autentificare** 
- orice student își poate crea cont pe baza adresei de email

2. **MP(Membru Proiect)** 
- poate crea/edita proiecte
- poate vizualiza bug-urile proiectelor din care face parte
- poate să își aloce rezolvarea unor bug-uri daca este membru în proiectul respectiv
- poate schimba statusul bug-urilor

3. **TST(Tester)**
- poate vizualiza și raporta bug-uri