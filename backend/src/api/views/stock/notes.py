# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.db.models import Stock, get_db
from src.db.dao import stock_dao
from src.schema import StockSchema

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


class StockNotesView(BaseApiView):
    async def get(
        self,
        stock_iden: str,
        session: AsyncSession = Depends(get_db),
    ):
        stock = await stock_dao.get_stock(stock_iden, session)
        schema = StockSchema.model_validate(stock)
        return {"data": schema.model_dump()}
