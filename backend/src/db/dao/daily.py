#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : daily
# @Time          : 2025-02-23 19:00:04
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
from src.db.models import Daily
from src.schema import DailyRequSchema
from .base import BaseDao


class DailyDao(BaseDao):
    def __init__(self):
        pass

    async def get_dailies(self, session: AsyncSession):
        return (await session.execute(select(Daily))).scalars()

    async def get_daily(self, date: str, session: AsyncSession):
        smtm = select(Daily)
        if date.isdigit():
            smtm = smtm.where(Daily.id == int(date))
        else:
            smtm = smtm.where(Daily.date == date)
        return (await session.execute(smtm)).scalars().first()

    async def create_daily(self, date, body: DailyRequSchema, session: AsyncSession):
        daily = Daily(date=date, title=body.title, content=body.content)
        session.add(daily)
        await session.commit()
        return daily

    async def update_daily(
        self, 
        date: str, 
        body: DailyRequSchema, session: AsyncSession):
        daily= await self.get_daily(date, session)
        if daily:
            daily.content = body.content
            daily.title = body.title
            await session.commit()

    async def delete_daily(self, date: str, session: AsyncSession):
        daily = await self.get_daily(date, session)
        if daily:
            await session.delete(daily)
            await session.commit()

daily_dao = DailyDao()
