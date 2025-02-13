#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : stock
# @Time          : 2025-02-08 21:17:38
"""
from typing import List, Dict, Tuple

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import (
    insert,
    select,
    update,
    func,
    types,
    delete,
    ChunkedIteratorResult,
)
from sqlalchemy.orm import selectinload

from src.settings import logger
from src.db.models import Stock, Group
from src.schema import StockRequestSchema


class StockDao(object):

    def _get_stock_stmt(self, schema: StockRequestSchema):
        stmt = select(Stock).options(selectinload(Stock.groups))
        if schema.code:
            stmt = stmt.where(Stock.code == schema.code)
        elif schema.name:
            stmt = stmt.where(Stock.name == schema.name)
        else:
            raise ValueError("code or name is required")
        return stmt

    async def _get_stock(self, schema: StockRequestSchema, session: AsyncSession):
        stmt = self._get_stock_stmt(schema)
        return (await session.execute(stmt)).scalars().first()

    def _get_group_stmt(self, group: str):
        stmt = select(Group)
        if group:
            stmt = stmt.where(Group.name == group)
        return stmt
    async def _get_group(self, group: str, session: AsyncSession) -> Group:
        stmt = self._get_group_stmt(group)
        return (await session.execute(stmt)).scalars().first()

    async def get_stock(
        self, schema: StockRequestSchema, session: AsyncSession
    ) -> Stock:
        """
        这个接口仅是获取股票的代码和名称
        """

        stmt = self._get_stock_stmt(schema)
        return (await session.execute(stmt)).scalars().first()

    async def _get_group_and_stock(self, schema: StockRequestSchema, session: AsyncSession) -> Tuple[Stock, Group]:
        stock = await self._get_stock(schema, session)
        if not stock:
            raise ValueError("stock is already exists")
        group: Group = await self._get_group(schema.group)
        if not group:
            raise ValueError("group is not exists")
        return stock, group
    async def group_add_stock(self, schema: StockRequestSchema, session: AsyncSession):
        stock, group = await self._get_group_and_stock(schema, session)
        group.add_stock_id(stock)
        await session.commit()
    async def group_delete_stock(self, schema: StockRequestSchema, session: AsyncSession):
        stock, group = await self._get_group_and_stock(schema, session)
        group.delete_stock_id(stock.id)
        await session.commit()
    async def bulk_insert_stock(self, data_list: List[Dict], session: AsyncSession):
        await session.execute(insert(Stock), data_list)
        await session.commit()

    async def delete_stock(
        self, schema: StockRequestSchema, session: AsyncSession
    ):

        if schema.code:
            stmt = select(Stock).where(
                Stock.code == schema.code
            )
        elif schema.name:
            stmt = select(Stock).where(
                Stock.name == schema.name
            )
        else:
            logger.error(f"There is no code or name when delete")
            return
        if schema.group:
            stmt = stmt.where(schema.group._in(Stock.groups))

        Stock_instance = (await session.scalars(stmt)).first()

        if Stock_instance:
            logger.debug(f"Delete container, {schema.code or schema.name}")
            await session.delete(Stock_instance)
            await session.flush()

stock_dao = StockDao()


# from sqlalchemy import select
#
# async def  fetch_data(session):
#     result = await session.execute(select(User).where(User.id == 1))
#     user = result.scalar()
#     return user

# from sqlalchemy import insert
#
# async def  insert_data(session, username, email):
#     stmt = insert(User).values(username=username, email=email)
#     await session.execute(stmt)
#     await session.commit()


# 异步查询数据：
#
# from sqlalchemy import select
#
#
# async def  fetch_data(session):
#     result = await session.execute(select(User).where(User.id == 1))
#     user = result.scalar()
#     return user
#
#
# 异步插入数据：
#
# from sqlalchemy import insert
#
#
# async def  insert_data(session, username, email):
#     stmt = insert(User).values(username=username, email=email)
#     await session.execute(stmt)
#     await session.commit()
#
#
# 异步更新数据：
#
# from sqlalchemy import update
#
#
# async def  update_data(session, user_id, new_username):
#     stmt = update(User).where(User.id == user_id).values(username=new_username)
#     await session.execute(stmt)
#     await session.commit()
#
#
# 异步删除数据：
#
# from sqlalchemy import delete
#
#
# async def  delete_data(session, user_id):
#     stmt = delete(User).where(User.id == user_id)
#     await session.execute(stmt)
#     await session.commit()
#
#
# 异步批量插入数据：
#
# from sqlalchemy import insert
#
#
# async def  bulk_insert_data(session, data_list):
#     data_list = [
#         {'username': 'user1', 'email': 'user1@example.com'},
#         {'username': 'user2', 'email': 'user2@example.com'},
#         # 添加更多数据...
#     ]
#     stmt = insert(User)
#     await session.execute(stmt, data_list)
#     await session.commit()
#
#
# 请注意，在异步环境中，await session.commit()
# 通常用于提交事务。异步操作涉及到协程和事件循环，确保你的代码运行在异步上下文中，例如使用
# async with Session() as session 确保你的会话是异步的。
