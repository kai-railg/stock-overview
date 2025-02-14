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
from src.schema import StockRequestSchema, GroupRequestSchema, UpdateGroupRequestSchema
from .base import BaseDao


class GroupDao(BaseDao):
    def __init__(self):
        pass

    async def get_group(self, schema: GroupRequestSchema, session: AsyncSession):
        return await self._get_group(schema.group, session)

    async def create_group(
        self, schema: GroupRequestSchema, session: AsyncSession
    ):
        group = self._get_group(schema.group, session)
        if group:
            raise ValueError("Group already exists")
        session.add(Group(name=group))
        await session.commit()

    async def delete_group(self, group: str, session: AsyncSession):
        group = self._get_group(group, session)
        if not group:
            raise ValueError("Group not found")
        session.delete(Group(name=group))
        await session.commit()

    async def update_group(self, schema: UpdateGroupRequestSchema, session: AsyncSession):
        if not schema.name:
            raise ValueError("Group name is required")
        group = await self._get_group(group, session)
        if not group:
            raise ValueError("Group not found")
        group.name = schema.name
        await session.commit()

    async def add_stock(self, schema: StockRequestSchema, session: AsyncSession):
        stock, group = await self._get_group_and_stock(schema, session)
        group.add_stock(stock)
        await session.commit()

    async def delete_stock(self, schema: StockRequestSchema, session: AsyncSession):
        stock, group = await self._get_group_and_stock(schema, session)
        group.delete_stock(stock.id)
        await session.commit()

    async def update_stock(self, schema: StockRequestSchema, session: AsyncSession):
        pass

group_dao = GroupDao()
