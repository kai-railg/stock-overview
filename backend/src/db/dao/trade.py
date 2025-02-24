#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : trade
# @Time          : 2025-02-24 19:41:25
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
from src.db.models import Trade
from src.schema import TradeRequSchema, TradeRespSchema
from .base import BaseDao


class TradeDao(BaseDao):
    def __init__(self):
        pass

    async def get_trades(self, session: AsyncSession):
        return (await session.execute(
            select(Trade).options(
            selectinload(Trade.stock)).order_by(
                Trade.id.desc()
            )
            )).scalars()

    async def get_trade(self, trade_id: int, session: AsyncSession):
        smtm = select(Trade).options(
            selectinload(Trade.stock)).where(
                Trade.id == trade_id)
        return (await session.execute(smtm)).scalars().first()

    async def create_trade(
            self, 
            body: TradeRequSchema, 
            stock_id: int, 
            returns: float,
            session: AsyncSession
        ):
        trade = Trade(
            trade_date=body.trade_date,
            trade_type=body.trade_type.value,
            stock_id=stock_id,
            volume=body.volume,
            price=body.price,
            reason=body.reason,
            fee=body.fee,
            returns=returns,
        )

        session.add(trade)
        await session.commit()
        return trade

    async def update_trade(
        self, trade_id: int, body: TradeRequSchema, stock_id: int, session: AsyncSession
    ):
        trade = await self.get_trade(trade_id, session)

        if trade:
            trade.trade_date=body.trade_date
            trade.trade_type=body.trade_type.value
            trade.volume = (body.volume)
            trade.price = (body.price)
            trade.reason = (body.reason)
            trade.fee = (body.fee)
            trade.stock_id = stock_id
            await session.commit()

    async def delete_trade(self, trade_id: int, session: AsyncSession):
        trade = await self.get_trade(trade_id, session)
        if trade:
            await session.delete(trade)
            await session.commit()


trade_dao = TradeDao()
