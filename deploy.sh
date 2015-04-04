#!/bin/sh
npm install;
bower install;
grunt cat-min;

#if [ -z "$1" -o "$1" != "-i" ]; then
#    scp -r ./client/images root@canihazbets.me:/root/bets/client;
#fi

scp -r ./client/sounds root@canihazbets.me:/root/bets/client;
scp -r ./client/app root@canihazbets.me:/root/bets/client;
scp -r ./client/style root@canihazbets.me:/root/bets/client;
scp -r ./client/dist root@canihazbets.me:/root/bets/client;
scp ./client/index.html root@canihazbets.me:/root/bets/client;
scp -r ./server root@canihazbets.me:/root/bets;
scp -r ./.bowerrc root@canihazbets.me:/root/bets;
scp -r ./bower.json root@canihazbets.me:/root/bets;
scp -r ./Gruntfile.js root@canihazbets.me:/root/bets;
scp -r ./package.json root@canihazbets.me:/root/bets;
scp -r ./build.sh root@canihazbets.me:/root/bets;