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


class BaseDao(object):

    def _get_stock_stmt(self, stock_iden: str):
        stmt = select(Stock).options(selectinload(Stock.notes))
        if not  stock_iden:
            raise ValueError("code or name is required")
        elif stock_iden.isdigit():
            stmt = stmt.where(Stock.code == stock_iden)
        else:
            stmt = stmt.where(Stock.name == stock_iden)
        return stmt

    async def _get_stock(self, stock_iden: str, session: AsyncSession):
        stmt = self._get_stock_stmt(stock_iden)
        return (await session.execute(stmt)).scalars().first()

    def _get_group_stmt(self, group: str):
        stmt = select(Group)
        if group:
            stmt = stmt.where(Group.name == group)
        return stmt

    async def _get_group(self, group: str, session: AsyncSession) -> Group:
        stmt = self._get_group_stmt(group)
        return (await session.execute(stmt)).scalars().first()

    async def _get_group_and_stock(
        self, group_name: str, stock_iden: str, session: AsyncSession
    ) -> Tuple[Stock, Group]:
        stock = await self._get_stock(stock_iden, session)
        if not stock:
            raise ValueError("stock is already exists")
        group: Group = await self._get_group(group_name, session)
        if not group:
            raise ValueError("group is not exists")
        return stock, group
