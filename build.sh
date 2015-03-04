cd ~/bets;
chmod a+x build.sh;
npm install;
bower --allow-root install;
rm client/dist/built.map;
kill -9 $(pgrep node);
nohup node --expose-gc server/server.js;