# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.access import pywencai_access
from src.db.dao import stock_dao
from src.db.models import Stock, get_db
from src.db.dao import stock_dao

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


class LowVolumeSelectView(BaseApiView):
    async def get(self, session: AsyncSession = Depends(get_db)):
        df = pywencai_access.custom_query(
            "创业板; 近10天内有>=1次的涨跌幅>7%"
        )
        data_list = []
        for row in df.iloc:
            code, market = row["股票代码"].split(".")
            name = row["股票简称"]
            data_list.append(
                {
                    "code": code,
                    "market": market,
                    "name": name,
                }
            )
        await stock_dao.bulk_insert_stock(data_list, session)
        return {"message": "创建成功", "data": data_list}
