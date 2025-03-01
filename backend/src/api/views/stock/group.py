# -*- encoding: utf-8 -*-

from src.middleware.api_view import BaseApiView
from src.db.models import Stock, get_db
from src.db.dao import group_dao, stock_dao
from src.access import qstock_access

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


class GroupView(BaseApiView):

    async def get(
        self,
        group_name: str,
        session: AsyncSession = Depends(get_db),
    ):
        if not group_name:
            raise HTTPException(status_code=404, detail="group not found")
        group = await group_dao.get_group(group_name, session)
        stock_info = []
        keys = [
            "名称",
            "代码",
            "最新",
            "涨幅",
            "金额",
            "换手",
            "量比",
            "最高",
            "最低",
            "今开",
            "昨收",
            "涨停",
            "跌停",
            "外盘",
            "内盘",
        ]
        for stock in group.get_stock_info().values():
            # 最新 30.69
            # 涨幅 -4.98
            # 金额 2989753873.22
            # 换手 13.9
            # 量比 0.72
            # 最高 33.3
            # 最低 30.52
            # 今开 32.0
            # 昨收 32.3
            # 涨停 38.76
            # 跌停 25.84
            # 外盘 443118.0
            # 内盘 486456.0
            realtime_data = qstock_access.realtime_data(stock["code"])
            stock = await stock_dao.get_stock(stock["code"], session)
            realtime_data.update({
                "市场": stock.market,
                "id": stock.id,
                "名称": stock.name,
                "代码": stock.code,
            })
            stock_info.append(realtime_data)

        return {
            "data": {
                "id": group.id,
                "name": group.name,
                "keys": keys,
                "stock_info": stock_info
            }
        }

    async def post(
        self,
        group_name: str,
        session: AsyncSession = Depends(get_db),
    ):
        if not group_name:
            raise HTTPException(status_code=404, detail="group not found")
        group = await group_dao.create_group(group_name, session)
        return {"message": "group created"}

    async def delete(
        self,
        group_name: str,
        session: AsyncSession = Depends(get_db),
    ):
        if not group_name:
            raise HTTPException(status_code=404, detail="group not found")
        await group_dao.delete_group(group_name, session)
        return {"message": "group created"}

    async def put(
        self,
        group_name: str, 
        session: AsyncSession = Depends(get_db),
    ):
        if not group_name:
            raise HTTPException(status_code=404, detail="group not found")
        await group_dao.update_group(group_name, session)
        return {"message": "group updated"}
