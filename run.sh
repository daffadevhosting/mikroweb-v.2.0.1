#!/bin/bash

trap "kill 0" EXIT


cd ~/backend
php -S localhost:5000 &

cd ~/frontend
bundle exec jekyll serve

# chmod +x run.sh
# ./run.sh