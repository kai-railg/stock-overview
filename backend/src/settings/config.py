# -*- encoding: utf-8 -*-

from typing import List

from starlette.config import Config
from starlette.datastructures import CommaSeparatedStrings

config = Config(".env")

# fastapi app config
TITLE: str = "Stock Overview"

ALLOWED_HOSTS: List[str] = config(
    "ALLOWED_HOSTS", cast=CommaSeparatedStrings, default=["*"]
)


# postgresql config
DATABASE_URL: str = config(
    "DATABASE_URL",
    cast=str,
    default=f"postgresql+asyncpg://postgres:postgres@localhost:5432/stock-overview",
)

# redis config
REDIS_CONNECT_TYPE = config("REDIS_CONNNECT_TYPE", cast=str, default="redis")
REDIS_HOST = config("REDIS_HOST", cast=str, default="127.0.0.1")
REDIS_PORT: int = config("REDIS_PORT", cast=int, default=6379)
REDIS_DB: int = config("REDIS_DB", cast=int, default=0)
REDIS_PASSWORD: int = config("REDIS_PASSWORD", cast=str, default="")
REDIS_SENTINELS: str = config("REDIS_SENTINELS", cast=str, default="127.0.0.1,6379;")
REDIS_SENTINEL_MASTER: str = config("REDIS_SENTINEL_MASTER", cast=str, default="master")
