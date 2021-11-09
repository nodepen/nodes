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
rm -rf gh/dispatch/glib/
cp -R lib/. gh/dispatch/glib/

# Re-install local lib
cd app
npm install
cd ../api
npm install
cd ../gh/dispatch
npm install