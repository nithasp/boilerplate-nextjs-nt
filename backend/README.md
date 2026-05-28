# Tasks Backend API

## Setup

### 1. Install packages
```bash
npm install
```

### 2. Database setup
The application uses **PostgreSQL** on port **5432**.

**Option A — Docker (recommended):**
```bash
docker-compose up -d
```
Starts PostgreSQL and creates `storefront_dev` + `storefront_test` databases automatically. Skip to step 4.

**Option B — Local PostgreSQL:**
```sql
CREATE USER storefront_user WITH PASSWORD 'storefront_pass';
CREATE DATABASE storefront_dev;
CREATE DATABASE storefront_test;
GRANT ALL PRIVILEGES ON DATABASE storefront_dev TO storefront_user;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront_user;
```

### 3. Environment variables
Copy `.env.example` to `.env` and fill in values:

```
ENV=dev
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=storefront_pass
BCRYPT_PASSWORD=your-secret-pepper
SALT_ROUNDS=10
TOKEN_SECRET=your-jwt-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY_DAYS=7
PORT=3000
ALLOWED_ORIGIN=http://localhost:4200
```

### 4. Run migrations
```bash
npm run migrate:up
```

### 5. Start the server
```bash
npm run watch    # development (auto-reload)
npm start        # production (build first)
```

### 6. Run tests
```bash
npm test
```

---

## API Routes

| Group | Base Path | Auth Required |
| ----- | --------- | ------------- |
| Auth  | `/auth`   | Partial       |
| Users | `/users`  | JWT           |
| Tasks | `/tasks`  | JWT           |

### Tasks Endpoints

| Method | Route         | Description                         |
| ------ | ------------- | ----------------------------------- |
| GET    | `/tasks`      | List all tasks for current user     |
| GET    | `/tasks/:id`  | Get task by id                      |
| POST   | `/tasks`      | Create a new task                   |
| PUT    | `/tasks/:id`  | Update a task (partial update)      |
| DELETE | `/tasks/:id`  | Delete a task                       |

All `/tasks` routes require a Bearer JWT and operate only on tasks owned by the authenticated user.

#### Task fields

| Field        | Type                                       | Required | Notes                         |
| ------------ | ------------------------------------------ | -------- | ----------------------------- |
| `title`      | `string`                                   | yes      | Non-empty                     |
| `description`| `string \| null`                           | no       |                               |
| `status`     | `'todo' \| 'in_progress' \| 'done'`        | no       | Defaults to `todo`            |
| `priority`   | `'low' \| 'medium' \| 'high'`              | no       | Defaults to `medium`          |
| `dueDate`    | `string \| null` (ISO `YYYY-MM-DD`)        | no       |                               |
| `completed`  | `boolean`                                  | no       | Defaults to `false`           |

---

## Ports

| Service  | Port |
| -------- | ---- |
| Backend  | 3000 |
| Database | 5432 |

## Scripts

| Command                  | Description                |
| ------------------------ | -------------------------- |
| `npm run watch`          | Dev server with auto-reload |
| `npm run build`          | Compile TypeScript          |
| `npm start`              | Run compiled server         |
| `npm test`               | Run test suite              |
| `npm run migrate:up`     | Run migrations              |
| `npm run migrate:down`   | Rollback last migration     |
| `npm run migrate:reset`  | Reset all migrations        |
