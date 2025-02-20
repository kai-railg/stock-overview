# -*- encoding: utf-8 -*-

from src.middleware.api_view import BaseApiView
from src.db.models import Stock, get_db
from src.db.dao import group_dao
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
        stocks = {}
        for stock in group.get_stock_info().values():
            stocks[stock["code"]] = stock

        realtime_data = qstock_access.realtime_data(stocks.keys())
        for row in realtime_data["data"]:
            # row
            # ['300377', '赢时胜', -1.43, 31.67, 32.2, 30.87, 31.05, 16.65, 0.64, -1282.97, 1072871, 3385650458.63, 32.13, 23786547784, 20404631965, '深A', '2025-02-14 15:34:24']
            stocks[row[0]]["realtime_data"] = {k:v for k, v in zip(realtime_data["keys"], row)}
        keys = realtime_data["keys"]

        for idx, key in enumerate(keys):
            if key in ["成交额", "总市值", "流通市值"]:
                keys[idx] = key + "（亿）"
        return {
            "data": {
                "id": group.id,
                "name": group.name,
                "keys": keys,
                "stock_info": [stock for stock in stocks.values()],
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
