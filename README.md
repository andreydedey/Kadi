# Kadi

Kadi is a personal finance management application that allows users to track their wallets, record transactions, manage spending categories with monthly limits, and control recurring subscriptions.
The back-end was built with ``Spring Boot`` and uses ``JWT`` for authentication, while the front-end was built with ``React`` and ``TypeScript``, providing a modern and responsive interface.
All data is persisted in a ``PostgreSQL`` database using ``Spring Data JPA``.

## 🔧 Main Technologies

**Back-end**
- **Spring Boot** – API framework
- **Spring Security + JWT** – Authentication and route protection
- **Spring Data JPA / Hibernate** – ORM and database access
- **PostgreSQL** – Relational database
- **Flyway** – Database migrations
- **MapStruct** – Object mapping between entities and DTOs
- **Lombok** – Boilerplate reduction

**Front-end**
- **React** – Graphical interface
- **TypeScript** – Static typing
- **TanStack Query** – Server state management and data fetching
- **React Hook Form + Zod** – Form handling and validation
- **Tailwind CSS** – Styling
- **Axios** – HTTP client

### Interface
- Dashboard page
<img width="1469" height="943" alt="Screenshot 2026-05-09 at 18 35 35" src="https://github.com/user-attachments/assets/75af2d0a-ffdb-4fb7-a6d9-9f86363adf95" />


- Wallet page
<img width="2938" height="1886" alt="image" src="https://github.com/user-attachments/assets/54e5eb92-f4fa-4248-9743-607ab3df76f3" />
<img width="2938" height="1886" alt="image" src="https://github.com/user-attachments/assets/15b41d85-1aa0-49dd-8437-2d6dd90b8a5c" />



- Categories page
<img width="2938" height="1886" alt="image" src="https://github.com/user-attachments/assets/7808d25f-61c5-432d-af86-29be97275196" />

- Settings page
<img width="2938" height="1886" alt="image" src="https://github.com/user-attachments/assets/8f75b44a-9488-494b-85c3-0f1ceb54d9dd" />


## ▶️ Running the project

**Prerequisites:** Java 21, Node.js, Bun and Docker

**1. Start the database**
```bash
docker-compose up -d
```

**2. Run the back-end**
```bash
cd server/kadi
./mvnw spring-boot:run
```
The API will be available at ``http://localhost:8080``

**3. Run the front-end**
```bash
cd client
bun install
bun dev
```
The application will be available at ``http://localhost:5173``

