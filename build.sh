cd ~/bets;
npm install;
bower --allow-root install;
grunt cat-min;
rm client/dist/built.map;
kill -9 $(pgrep node);
nohup node --expose-gc server/server.js;