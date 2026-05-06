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

### Interface
