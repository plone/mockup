#!/bin/bash

echo "git checkout es6"
git checkout es6
echo "git fetch --all"
git fetch --all
NOW=$(date +"%Y-%m-%d_%H%M%S")
echo "git checkout -b backup-es6-$NOW"
git checkout -b "backup-es6-$NOW"
echo "git checkout es6"
git checkout es6
echo "git reset --hard origin/es6"
git reset --hard origin/es6
