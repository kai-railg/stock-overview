#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : stocks
# @Time          : 2025-02-08 20:41:46
"""


from src.middleware.api_view import BaseApiView
from src.schema import StockRequestSchema
from src.db.models import Stock, get_db
from src.db.dao import stock_dao

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


class GroupStockApiView(BaseApiView):

    def post(
        self,
        body: StockRequestSchema,
        session: AsyncSession = Depends(get_db),
    ):
        if not body.group:
            raise HTTPException(status_code=404, detail="group not found")
        stock = stock_dao.group_add_stock(body, session)
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")
        return stock

    def put(
        self,
        body: StockRequestSchema,
        session: AsyncSession = Depends(get_db),
    ):
        if not body.group:
            raise HTTPException(status_code=404, detail="group not found")
        stock = stock_dao.group_add_stock(body, session)
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")
        return stock

    def delete(self, body: StockRequestSchema):
        pass
