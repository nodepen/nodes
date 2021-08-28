# Build shared dependencies
cd ../lib
npm install
npm run build

# Copy dependencies into projects
cd ..
rm -rf app/glib/
cp -R lib/. app/glib/
rm -rf app/glib/
cp -R lib/. api/glib/

# Run docker-compose logic
docker compose -f compose.local.yaml up