# Build shared dependencies
cd ../lib
npm install
npm run build

# Copy dependencies into projects
cd ..
rm -rf app/glib/
cp -R lib/. app/glib/
rm -rf api/glib/
cp -R lib/. api/glib/
rm -rf bq/gh/dispatch/glib/
cp -R lib/. bq/gh/dispatch/glib/
rm -rf bq/render/glib/
cp -R lib/. bq/render/glib/

# Re-install local lib
cd app
npm install
cd ../api
npm install
cd ../bq/gh/dispatch
npm install
cd ../../render
npm install