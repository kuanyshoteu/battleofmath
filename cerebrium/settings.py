"""
Django settings for cerebrium project.

Generated by 'django-admin startproject' using Django 2.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os
import dj_database_url
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/
toserver = False
# SECURITY WARNING: don't run with debug turned on in production!
if toserver:
    DEBUG = False
    ALLOWED_HOSTS = ['www.cerebrium.kz', 'cerebrium.kz']
else:
    DEBUG = True
    ALLOWED_HOSTS = ['*'] #['www.bilimtap.kz', 'bilimtap.kz', 'pinocchio.kz', 'www.pinocchio.kz']
from cerebrium.secrets import *
# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'accounts',
    'django.contrib.postgres',
    'papers',
    'tasks',
    'library',
    'adventures',
    'landwars',
    'main',
    'channels',
    'compressor',
    'tailwind',
    'frontend',
    'django_browser_reload',
]
# Frontend css framework
TAILWIND_APP_NAME = 'frontend'
INTERNAL_IPS = [
    "127.0.0.1",
]

CRISPY_TEMPLATE_PACK = 'bootstrap3'
if toserver:
    PIPELINE_ENABLED = True
    SECURE_SSL_REDIRECT = True # [1]
# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
MIDDLEWARE = [
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.gzip.GZipMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',
    'htmlmin.middleware.HtmlMinifyMiddleware',
    'htmlmin.middleware.MarkRequestMiddleware',
    'django_browser_reload.middleware.BrowserReloadMiddleware',
]
HTML_MINIFY = True
ROOT_URLCONF = 'cerebrium.urls'
CORS_ORIGIN_ALLOW_ALL = True
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontent.templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',  # <--
                'social_django.context_processors.login_redirect', # <--
            ],
        },
    },
]
AUTHENTICATION_BACKENDS = (
    'social_core.backends.github.GithubOAuth2',
    'social_core.backends.twitter.TwitterOAuth',
    'social_core.backends.facebook.FacebookOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

#WSGI_APPLICATION = 'cerebrium.wsgi.application'
#REDIS_URL='redis://h:p04805ed78b5ba825c92c34d209a538835bbbb5eddce36ec7a904974cc76fcbd4@ec2-108-129-69-107.eu-west-1.compute.amazonaws.com:14599'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
#            "hosts":[os.environ.get('REDIS_URL', 'redis://localhost:6379')]
        },
    },
}
# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
if toserver:
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config('DATABASE_URL')
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'bofm',
            'USER': 'admin',
            'PASSWORD': '031196Kk',
            'HOST': 'localhost',
            'PORT': '',
        }
    }

# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/
LANGUAGE_CODE = 'ru-RU'
TIME_ZONE = 'Asia/Almaty'
USE_I18N = True
USE_L10N = True
USE_TZ = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/
from cerebrium.aws.conf import *

#STATIC_URL = '/static/'

#STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage CompressedManifestStaticFilesStorage'    
    
import datetime
AWS_ACCESS_KEY_ID = 'AKIAQE4L4EWQW6YRAK43'
#'AKIAQE4L4EWQRLWPNLEG'
AWS_SECRET_ACCESS_KEY = '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'
#'A4vH8IFm+toG99z7YtI4Dnk3Vwdwau27Bueq8X0q'
if toserver:
    AWS_FILE_EXPIRE = 200
    AWS_PRELOAD_METADATA = True
    AWS_QUERYSTRING_AUTH = False
    CLOUDFRONT_DOMAIN = 'd2keambcwaj901.cloudfront.net'
    CLOUDFRONT_ID = 'E1DIVWQNJ8N4FW'
    AWS_S3_CUSTOM_DOMAIN = 'd2keambcwaj901.cloudfront.net'
    AWS_SECURE_URLS = True
    AWS_IS_GZIPPED = True
    AWS_PRELOAD_METADATA = True

# if toserver:
#     STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
# else:
#     STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
# AWS_STORAGE_BUCKET_NAME = 'triplea-bucket'

STATIC_ROOT = os.path.join(BASE_DIR, "static_cdn")
#STATIC_URL = 'https://d2keambcwaj901.cloudfront.net/'
import environ
env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)
if toserver:
    STATIC_URL = '/frontend/static/'      
else:
    STATIC_HOST = env('DJANGO_STATIC_HOST', default='')
    STATIC_URL = STATIC_HOST + '/frontend/static/'
COMPRESS_OFFLINE = toserver
COMPRESS_ENABLED = toserver
COMPRESS_URL = STATIC_URL
COMPRESS_CSS_FILTERS = [
    'compressor.filters.css_default.CssAbsoluteFilter',
    'compressor.filters.cssmin.CSSMinFilter'
]
COMPRESS_STORAGE = 'compressor.storage.GzipCompressorFileStorage'
COMPRESS_JS_FILTERS = [
    'compressor.filters.jsmin.JSMinFilter',
]
GZIP_CONTENT_TYPES = (
    'text/css',
    'application/javascript',
    'application/x-javascript',
    'text/javascript'
)

# S3DIRECT_REGION = 'us-west-2'
# S3_URL = '//triplea-bucket.s3.amazonaws.com/'
# MEDIA_URL = '//triplea-bucket.s3.amazonaws.com/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, "frontend/images")

two_months = datetime.timedelta(days=61)
date_two_months_later = datetime.date.today() + two_months
expires = date_two_months_later.strftime("%A, %d %B %Y 20:00:00 GMT")

AWS_HEADERS = {
    'Expires': expires,
    'Cache-Control': 'max-age=%d' % (int(two_months.total_seconds()), ),
}

STATICFILES_DIRS = [
#    str(BASE_DIR.path('static')),
    os.path.join(BASE_DIR, "frontend/static"),
    #'/var/www/static/',
]
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder' # Django-Compressor
]
# MEDIA_URL = '/media_cdn/'
# MEDIA_ROOT = os.path.join(BASE_DIR, "media_cdn")
# EMAIL
