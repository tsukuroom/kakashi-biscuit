#!/bin/sh

KAKASHI_HOME=$(cd $(dirname $0); pwd)/..

mkdir -p $KAKASHI_HOME/images
mkdir -p $KAKASHI_HOME/log

CARDNO=$(aplay -l | grep USB | awk '{sub(/.$/,"",$2); print $2}')

export AUDIODRIVER=alsa
export AUDIODEV=plughw:${CARDNO:-0},0

export CLARIFAI_ID=<clarifai_id>
export CLARIFAI_SECRET=<clarifai_secret>

cd $KAKASHI_HOME
DEBUG=index,theta,imageprocessor,birdrecognizer /usr/bin/node . >>$KAKASHI_HOME/log/kakashi.log 2>&1 &

