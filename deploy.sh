#!/bin/sh
npm install;
bower install;
grunt cat-min;
scp . root@canihazbets.me:/root/bets;
scp -r ./client/images root@canihazbets.me:/root/bets/client;
scp -r ./client/app root@canihazbets.me:/root/bets/client;
scp -r ./client/style root@canihazbets.me:/root/bets/client;
scp ./client/index.html root@canihazbets.me:/root/bets/client;
scp -r ./server root@canihazbets.me:/root/bets;
scp -r ./.bowerrc root@canihazbets.me:/root/bets;
scp -r ./bower.json root@canihazbets.me:/root/bets;
scp -r ./Gruntfile.js root@canihazbets.me:/root/bets;
scp -r ./package.json root@canihazbets.me:/root/bets;
scp -r ./build.sh root@canihazbets.me:/root/bets;