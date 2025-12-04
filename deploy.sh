#!/bin/bash

# ScaleUp Quick Deploy Script for DigitalOcean
# Run this script on your Ubuntu droplet

set -e

echo "🚀 ScaleUp Deployment Script"
echo "=============================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run as root (use: sudo bash deploy.sh)"
  exit 1
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose if not present
if ! docker compose version &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    apt-get update
    apt-get install -y docker-compose-plugin
else
    echo "✅ Docker Compose already installed"
fi

# Create deployment directory
DEPLOY_DIR="/opt/scaleup"
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# Create docker-compose.yml
echo "📝 Creating docker-compose.yml..."
cat > docker-compose.yml << 'EOF'
services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme123}
      POSTGRES_DB: ${POSTGRES_DB:-scaleup_production}
    restart: always
    networks:
      - scaleup-network

  redis:
    image: redis:7
    restart: always
    networks:
      - scaleup-network

  backend:
    image: charanwork/scaleup-backend:latest
    command: bash -c "rm -f tmp/pids/server.pid && bundle check || bundle install && rails db:create db:migrate db:seed && rails s -b '0.0.0.0'"
    volumes:
      - backend_gems:/usr/local/bundle
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
    environment:
      RAILS_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-changeme123}@db:5432/${POSTGRES_DB:-scaleup_production}
      REDIS_URL: redis://redis:6379/1
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      RAILS_SERVE_STATIC_FILES: "true"
      RAILS_LOG_TO_STDOUT: "true"
    restart: always
    networks:
      - scaleup-network

  sidekiq:
    image: charanwork/scaleup-backend:latest
    command: bash -c "bundle check || bundle install && bundle exec sidekiq"
    volumes:
      - backend_gems:/usr/local/bundle
    depends_on:
      - db
      - redis
      - backend
    environment:
      RAILS_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-changeme123}@db:5432/${POSTGRES_DB:-scaleup_production}
      REDIS_URL: redis://redis:6379/1
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
    restart: always
    networks:
      - scaleup-network

  frontend:
    image: charanwork/scaleup-frontend:latest
    command: sh -c "npm install && npm run build && npx serve -s dist -l 5173"
    volumes:
      - frontend_node_modules:/app/node_modules
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: ${VITE_API_URL}
    restart: always
    networks:
      - scaleup-network

volumes:
  postgres_data:
  backend_gems:
  frontend_node_modules:

networks:
  scaleup-network:
    driver: bridge
EOF

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

# Generate SECRET_KEY_BASE
SECRET_KEY=$(openssl rand -hex 64)

# Create .env file
echo "📝 Creating .env file..."
cat > .env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(openssl rand -base64 32)
POSTGRES_DB=scaleup_production
SECRET_KEY_BASE=$SECRET_KEY
VITE_API_URL=http://$SERVER_IP:3000
EOF

echo ""
echo "✅ Configuration files created!"
echo ""
echo "📋 Your configuration:"
echo "   Frontend: http://$SERVER_IP:5173"
echo "   Backend API: http://$SERVER_IP:3000"
echo ""

# Setup firewall
echo "🔥 Setting up firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp
    ufw allow 5173/tcp
    echo "y" | ufw enable || true
    echo "✅ Firewall configured"
else
    echo "⚠️  UFW not found, skipping firewall setup"
fi

# Pull and start services
echo ""
echo "🐳 Pulling Docker images..."
docker compose pull

echo ""
echo "🚀 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "📊 Service status:"
docker compose ps

echo ""
echo "=============================="
echo "✅ Deployment Complete!"
echo "=============================="
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://$SERVER_IP:5173"
echo "   Backend API: http://$SERVER_IP:3000"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker compose logs -f"
echo "   Restart: docker compose restart"
echo "   Stop: docker compose down"
echo "   Update: docker compose pull && docker compose up -d"
echo ""
echo "⚠️  IMPORTANT: Update your .env file with a custom domain if needed!"
echo "   Edit: nano $DEPLOY_DIR/.env"
echo ""
