rm -r ./DnDHue
cd ../api/
NODE_ENV=production
npm run build
cd ../dnd-hue/
npm run build
cd ../build/
mkdir DnDHue
mkdir ./DnDHue/api
#mkdir ./DnDHue/assets
cp -R ../api/dist/* ./DnDHue/api
cp ../api/package*.json ./DnDHue/api
#cp ../api/src/assets/* ./DnDHue/assets
mkdir ./DnDHue/dnd-hue/
mkdir ./DnDHue/dnd-hue/dist
cp -R ../dnd-hue/dist/* ./DnDHue/dnd-hue/dist
cp ../dnd-hue/package*.json ./DnDHue/dnd-hue
cp ./prod.env ./DnDHue/.env
rm -r ../api/dist
rm -r ../dnd-hue/dist
read -n 1 -s -r -p "Press any key to continue"