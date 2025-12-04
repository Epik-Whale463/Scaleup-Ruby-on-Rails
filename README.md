# ScaleUp - Mentorship Booking System

A full-stack mentorship booking platform built with Ruby on Rails, React, and Docker.

## What it does

Book 1-on-1 sessions with mentors. Simple as that.

- Pick a mentor
- Choose a time
- Get email confirmation (simulated)
- View your bookings

## Tech Stack

**Backend:**
- Ruby on Rails 7.1 (API mode)
- PostgreSQL 15
- Redis + Sidekiq for background jobs

**Frontend:**
- React 19 + Vite
- Tailwind CSS v4 (neo-brutalism design)

**Infrastructure:**
- Docker & Docker Compose
- Nginx-ready for production

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Epik-Whale463/Scaleup-Ruby-on-Rails.git
cd Scaleup-Ruby-on-Rails

# Start everything
docker compose up

# Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

That's it. Docker handles the rest.

## Project Structure

```
ScaleUp/
├── backend/          # Rails API
├── frontend/         # React app
├── docker-compose.yml
└── deploy.sh         # Production deployment script
```

## Features

- Mentor selection with live availability
- Real-time booking validation (no double-booking)
- Email notifications via Sidekiq
- Booking history per user
- Responsive design (mobile + desktop)
- Neo-brutalism UI with animations

## Development

```bash
# View logs
docker compose logs -f

# Restart services
docker compose restart

# Access Rails console
docker compose exec backend rails console

# Run migrations
docker compose exec backend rails db:migrate
```

## Deployment

Images are on Docker Hub:
- `charanwork/scaleup-backend:latest`
- `charanwork/scaleup-frontend:latest`

Deploy to any server with Docker:
```bash
# On your server (Ubuntu)
sudo bash deploy.sh
```

See `DEPLOYMENT.md` for detailed instructions.

## API Endpoints

```
GET  /mentors          # List all mentors
POST /bookings         # Create a booking
GET  /bookings         # List all bookings
```

## Environment Variables

**Development:** Works out of the box

**Production:** Create `.env` file:
```env
POSTGRES_PASSWORD=your_password
SECRET_KEY_BASE=your_secret_key
VITE_API_URL=http://your-server:3000
```

## Notes

- Database seeds 3 sample mentors on first run
- Bookings validate no time conflicts
- Email is simulated (check Sidekiq logs)
- Frontend rebuilds on file changes (hot reload)

## Built by

Just a dev trying to make mentorship booking less painful.

## License

Do whatever you want with it.
