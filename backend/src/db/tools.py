#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : tools
# @Time          : 2025-02-12 08:54:38
"""

import asyncio
import os
import typing

import sqlalchemy as sa
from sqlalchemy.exc import OperationalError, ProgrammingError
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy_utils.functions.database import (
    _set_url_database,
    _sqlite_file_exists,
    make_url,
)
from sqlalchemy_utils.functions.orm import quote

from src.db.models import engine, Base
from src.settings import logger, DATABASE_URL


async def _get_scalar_result(engine, sql):
    try:
        async with engine.connect() as conn:
            return await conn.scalar(sql)
    except Exception as e:
        return False


async def aio_database_exists(url):
    url = make_url(url)
    database = url.database
    dialect_name = url.get_dialect().name
    engine = None
    try:
        if dialect_name == "postgresql":
            text = "SELECT 1 FROM pg_database WHERE datname='%s'" % database
            for db in (database, "postgres", "template1", "template0", None):
                url = _set_url_database(url, database=db)
                engine = create_async_engine(url)
                try:
                    return bool(await _get_scalar_result(engine, sa.text(text)))
                except (ProgrammingError, OperationalError):
                    pass
            return False

        elif dialect_name == "mysql":
            url = _set_url_database(url, database=None)
            engine = create_async_engine(url)
            text = (
                "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA "
                "WHERE SCHEMA_NAME = '%s'" % database
            )
            return bool(await _get_scalar_result(engine, sa.text(text)))

        elif dialect_name == "sqlite":
            url = _set_url_database(url, database=None)
            engine = create_async_engine(url)
            if database:
                return database == ":memory:" or _sqlite_file_exists(database)
            else:
                # The default SQLAlchemy database is in memory, and :memory: is
                # not required, thus we should support that use case.
                return True
        else:
            text = "SELECT 1"
            try:
                engine = create_async_engine(url)
                return bool(await _get_scalar_result(engine, sa.text(text)))
            except (ProgrammingError, OperationalError):
                return False
    finally:
        if engine:
            await engine.dispose()


async def aio_create_database(url, encoding="utf8", template=None):
    url = make_url(url)
    database = url.database
    dialect_name = url.get_dialect().name
    dialect_driver = url.get_dialect().driver

    url = _set_url_database(url, database=None)

    if (dialect_name == "mssql" and dialect_driver in {"pymssql", "pyodbc"}) or (
        dialect_name == "postgresql"
        and dialect_driver in {"asyncpg", "pg8000", "psycopg2", "psycopg2cffi"}
    ):
        engine = create_async_engine(url, isolation_level="AUTOCOMMIT")
    else:
        engine = create_async_engine(url)

    if dialect_name == "postgresql":
        if not template:
            template = "template1"

        async with engine.begin() as conn:
            text = "CREATE DATABASE {} ENCODING '{}' TEMPLATE {}".format(
                quote(conn, database), encoding, quote(conn, template)
            )
            await conn.execute(sa.text(text))

    elif dialect_name == "mysql":
        async with engine.begin() as conn:
            text = "CREATE DATABASE {} CHARACTER SET = '{}'".format(
                quote(conn, database), encoding
            )
            await conn.execute(sa.text(text))

    elif dialect_name == "sqlite" and database != ":memory:":
        if database:
            async with engine.begin() as conn:
                await conn.execute(sa.text("CREATE TABLE DB(id int)"))
                await conn.execute(sa.text("DROP TABLE DB"))

    else:
        async with engine.begin() as conn:
            text = f"CREATE DATABASE {quote(conn, database)}"
            await conn.execute(sa.text(text))

    await engine.dispose()


def is_async_driver(url):
    url = make_url(url)
    database = url.database
    dialect_name = url.get_dialect().name
    dialect_driver = url.get_dialect().driver

    if dialect_name == "oracle" and dialect_driver == "oracledb":
        return False
    else:
        return True


async def create_db_if_not_exists(url=DATABASE_URL, encoding="utf8", template=None):
    if is_async_driver(url):
        if not await aio_database_exists(url):
            await aio_create_database(url, encoding=encoding, template=template)
    else:
        logger.info("Notice, this driver doesn't support automatic database creation")


async def create_all_tables(engine=engine):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.reflect)
        await conn.run_sync(Base.metadata.create_all)
