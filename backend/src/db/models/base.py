# -*- coding: utf-8 -*-
"""
@Version :  python3.9
@Time    :  2023/9/4 11:16 AM
@Author  :  kai.wang
@Email   :  kai.wang@westwell-lab.com
"""
import traceback
from contextlib import contextmanager, suppress

import sqlalchemy.exc
from sqlalchemy.orm import sessionmaker, declarative_base, DeclarativeMeta
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from src.settings import DATABASE_URL

engine = create_async_engine(DATABASE_URL, pool_size=20, max_overflow=0)
SessionLocal = sessionmaker(
    class_=AsyncSession,
    autocommit=False, 
    autoflush=False, 
    bind=engine
)

Base: DeclarativeMeta = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session
    # session = None
    # try:
    #     session = SessionLocal()
    #     # with suppress(Exception):
    #     yield session
    # except Exception as e:
    #     if session:
    #         session.rollback()
    #     raise Exception(e)
    # else:
    #     try:
    #         session.commit()
    #     except sqlalchemy.exc.SQLAlchemyError as e:
    #         # s = str(e).split("\n")[0]
    #         # GP.report_error(f"sqlalchemy.err: {s}")
    #         raise Exception(e)
    # finally:
    #     if session:
    #         session.close()


# 自动创建数据库SQL
async def auto_create_database():
    """ """
    # -- 判断数据库是否存在
    # SELECT COUNT(*) AS db_exists FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'dbname';
    # -- 如果数据库不存在，则执行创建数据库的SQL语句
    # SET @create_db_sql = IF((SELECT COUNT(*) FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'dbname') = 0, 'CREATE DATABASE dbname;', '');
    # -- 执行创建数据库的SQL语句
    # PREPARE stmt FROM @create_db_sql;
    # EXECUTE stmt;
    # DEALLOCATE PREPARE stmt;

    with get_db_with_generator() as session:
        result = session.execute(
            sqlalchemy.text(
                "SELECT COUNT(*) AS db_exists FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'inventory'"
            )
        )
        db_exists = result.fetchone()[0]
        # 如果数据库不存在，则执行创建数据库的SQL语句
        if db_exists == 0:
            session.execute(sqlalchemy.text("CREATE DATABASE inventory charset='utf8'"))


if __name__ == "__main__":
    with get_db_with_generator() as session:
        raise Exception("test")
