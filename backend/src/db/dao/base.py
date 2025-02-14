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

    async def _get_group_and_stock(
        self, schema: StockRequestSchema, session: AsyncSession
    ) -> Tuple[Stock, Group]:
        stock = await self._get_stock(schema, session)
        if not stock:
            raise ValueError("stock is already exists")
        group: Group = await self._get_group(schema.group)
        if not group:
            raise ValueError("group is not exists")
        return stock, group
