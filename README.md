# Run Docker

1. `docker compose build`
2. `docker compose up`
3. Frontend: http://localhost:5173
4. Backend: http://localhost:4000   
5. To stop `docker compose down -v`

## Email (Gmail)

The API email service uses Gmail SMTP via Nodemailer.

- `GMAIL_APP_EMAIL`
- `GMAIL_APP_PASSWORD`

You can provide these via your shell environment or an `.env` file in `apps/api/`.

## Forgot password

- UI: http://localhost:5173/forgot-password
- API:
	- `POST /auth/forgot-password` (sends a reset code)
	- `POST /auth/reset-password` (verifies code + sets new password)

Note: the database init schema was updated to include `password_reset_codes`. If you already have a persisted Docker volume, you’ll need to recreate it (`docker compose down -v`) or apply the table manually.