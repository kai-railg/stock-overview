#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : gropu
# @Time          : 2025-02-14 09:22:12
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
from .base import BaseDao


class GroupDao(BaseDao):
    def __init__(self):
        pass
    async def get_all_groups(self, session: AsyncSession):
        return (await session.execute(select(Group))).scalars()
    async def get_group(self, group_name: str, session: AsyncSession):
        return await self._get_group(group_name, session)

    async def create_group(
        self, group_name: str, session: AsyncSession
    ):
        group = await self._get_group(group_name, session)
        if group:
            raise ValueError("Group already exists")
        session.add(Group(name=group_name))
        await session.commit()

    async def delete_group(self, group: str, session: AsyncSession):
        group_ins =await self._get_group(group, session)
        if not group_ins: 
            raise ValueError("Group not found")
        await session.delete(group_ins)
        await session.commit()

    async def update_group(self, group_name: str, session: AsyncSession):
        if not group_name:
            raise ValueError("Group name is required")
        group = await self._get_group(group, session)
        if not group:
            raise ValueError("Group not found")
        group.name = group_name
        await session.commit()

    async def add_stock(self, group_name: str, stock_iden: str, session: AsyncSession):
        stock, group = await self._get_group_and_stock(group_name, stock_iden, session)
        group.add_stock(stock)
        await session.commit()

    async def delete_stock(
        self, group_name: str, stock_iden: str, session: AsyncSession
    ):
        stock, group = await self._get_group_and_stock(group_name, stock_iden, session)
        group.delete_stock(stock.id)
        await session.commit()

    async def update_stock(self, group_name: str, stock_iden: str, session: AsyncSession):
        pass

group_dao = GroupDao()
