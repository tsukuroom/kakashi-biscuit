#!/bin/sh

KAKASHI_HOME=$(cd $(dirname $0); pwd)/..

mkdir -p $KAKASHI_HOME/images
mkdir -p $KAKASHI_HOME/log

export AUDIODRIVER=alsa
export AUDIODEV=plughw:1,0

export CLARIFAI_ID=<clarifai_id>
export CLARIFAI_SECRET=<clarifai_secret>

cd $KAKAKSHI_HOME
DEBUG=index,theta,birdrecognizer /usr/bin/node . >>$KAKASHI_HOME/log/kakashi.log 2>&1 &

