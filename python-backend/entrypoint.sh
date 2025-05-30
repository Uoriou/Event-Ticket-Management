#!/bin/sh
set -e  

echo "Running makemigrations"
python3 manage.py makemigrations

echo "Running migrate"
python3 manage.py migrate

echo "Starting server"
exec python3 manage.py runserver 0.0.0.0:9000
