cd ~/bets;
chmod a+x build.sh;
npm install;
bower --allow-root install;
kill -9 $(pgrep node);
nodejs server/server.js;