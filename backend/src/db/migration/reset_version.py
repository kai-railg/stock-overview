#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : reset_version
# @Time          : 2025-02-11 21:46:50
"""

import asyncio
from src.db.async_pg import pg_sessionmaker
from sqlalchemy.sql import text as sa_text

import traceback


async def rm_alembic_version():
    async with pg_sessionmaker() as session:
        try:
            await session.execute(sa_text('''TRUNCATE TABLE alembic_version'''))
            await session.commit()
        except:
            pass
            # print(f"error: {traceback.format_exc()}")


if __name__ == "__main__":
    asyncio.run(rm_alembic_version())
