#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : stocks
# @Time          : 2025-02-08 20:41:46
"""


from src.middleware.api_view import BaseApiView
from src.schema import StockRequestSchema
from src.db.models import Stock, get_db_with_generator
from src.db.dao import stock_dao

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


class StockSchemaView(BaseApiView):

    def get(
        self,
        body: StockRequestSchema,
        session: AsyncSession = Depends(get_db_with_generator),
    ):
        stock = stock_dao.get_stock(body, session)
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")
        return stock

    def post(self, body: StockRequestSchema):
        pass

    def put(self, body: StockRequestSchema):
        pass
    def delete(self, body: StockRequestSchema):
        pass
