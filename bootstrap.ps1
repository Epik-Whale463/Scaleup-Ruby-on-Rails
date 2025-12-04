Write-Host "Building Docker images..."
docker-compose build

Write-Host "Generating Rails App..."
# --skip-git because we are already in a repo (presumably) or we don't want nested git
docker-compose run --rm backend rails new . --api --database=postgresql --skip-bundle --skip-git --force

Write-Host "Generating Frontend App..."
docker-compose run --rm frontend npm create vite@latest . -- --template react
docker-compose run --rm frontend npm install

Write-Host "Bootstrap complete. Now configuring database..."
