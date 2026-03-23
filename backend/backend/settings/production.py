import os

import dj_database_url
try:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
except ImportError:  # pragma: no cover - keeps production bootable if SDK is absent
    sentry_sdk = None
    DjangoIntegration = None

from .base import *

SECRET_KEY = os.environ['SECRET_KEY']
DEBUG = False
ALLOWED_HOSTS = get_env_list('ALLOWED_HOSTS')
CORS_ALLOWED_ORIGINS = get_env_list('CORS_ALLOWED_ORIGINS')

STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True
    )
}

SENTRY_DSN = os.environ.get('SENTRY_DSN')

if SENTRY_DSN and sentry_sdk and DjangoIntegration:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration()],
        send_default_pii=True,
        traces_sample_rate=float(os.environ.get('SENTRY_TRACES_SAMPLE_RATE', '1.0')),
        environment=os.environ.get('SENTRY_ENVIRONMENT', 'production'),
    )
