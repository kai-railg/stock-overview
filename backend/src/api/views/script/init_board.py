#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : init_board
# @Time          : 2025-02-16 22:30:19
"""

from src.middleware.api_view import BaseApiView
from src.access import pywencai_access
from src.db.dao import stock_dao
from src.db.models import Stock, get_db
from src.db.dao import stock_dao

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
import efinance as ef

class InitBoardScriptView(BaseApiView):
    async def get(self, session: AsyncSession = Depends(get_db)):
        df = ef.stock.get_belong_board("300085")
        # 查看某一只股票情况
        for row in df.iloc:
            row[""]
        await stock_dao.bulk_insert_stock(data_list, session)
        return {"message": "创建成功", "data": data_list}
