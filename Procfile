web: gunicorn hello:application --preload
release: python manage.py migrate
release: python manage.py collectstatic