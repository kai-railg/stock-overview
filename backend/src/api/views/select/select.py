# -*- encoding: utf-8 -*-
import datetime

from src.middleware.api_view import BaseApiView
from src.access import pywencai_access, qstock_access
from src.db.dao import stock_dao
from src.db.models import Stock, get_db
from src.db.dao import stock_dao

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession


class SelectView(BaseApiView):
    async def get(
        self, 
        strategy: str, 
        session: AsyncSession = Depends(get_db)):
        message = "查询成功"
        result = []
        match strategy:
            case "接近前低":
                result = await self.near_close_price(session)
            case _:
                message = "参数有误, strategy=?"

        return {"message": message, "data": result}

    # 量能连续萎缩
    def find_close_price(self, history_datas, price):
        length = len(history_datas)
        for idx, row in enumerate(history_datas[::-1]):
            low = row["最低"]

            # 区间内的最低价必须大于price
            if low > price:
                continue
            # 超过10天的周期
            if idx >= 10:
                # 误差不超过3%
                if abs(low - price) / price <= 0.05:
                    # 找到低点后，再倒推10天，判断是否还有低点
                    start = length - idx - 5
                    start = start if start > 0 else 0
                    before_low = min(
                        [hd["最低"] for hd in history_datas[start : length - idx]]
                    )
                    if abs(before_low - low) / low <= 0.05:
                        return row["日期"]
            return False

    # 接近前低
    async def near_close_price(self, session):
        result = []
        date_str = (
            datetime.datetime.now() - datetime.timedelta(days=60)
            ).strftime("%Y%m%d")

        for stock in qstock_access.board():
            history_data = qstock_access.history_data(stock["代码"], start=date_str)
            date = self.find_close_price(history_data, stock["最低"])
            if date:
                result.append([stock["代码"], stock["名称"], date])
        return result
