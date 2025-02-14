# -*- encoding: utf-8 -*-

from src.middleware.api_view import BaseApiView
from src.schema import GroupRequestSchema, UpdateGroupRequestSchema
from src.db.models import Stock, get_db
from src.db.dao import group_dao
from src.access import qstock_access

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


class GroupView(BaseApiView):

    async def get(
        self,
        body: GroupRequestSchema,
        session: AsyncSession = Depends(get_db),
    ):
        if not body.group:
            raise HTTPException(status_code=404, detail="group not found")
        group = await group_dao.get_group(body, session)
        stocks = {}
        for stock in group.get_stock_info().values():
            stocks[stock["code"]] = stock

        realtime_data = qstock_access.realtime_data(stocks.keys())
        for row in realtime_data["data"]:
            stocks[row["code"]]["realtime_data"] = {k:v for k, v in zip(realtime_data["keys"], row)}

        return {
            "data": {
                "group": group.name,
                "stock_info": stocks.values(),
            }
        }

    async def post(
        self,
        body: GroupRequestSchema,
        session: AsyncSession = Depends(get_db),
    ):
        if not body.group:
            raise HTTPException(status_code=404, detail="group not found")
        group = await group_dao.create_group(body, session)
        return {"message": "group created"}

    async def delete(
        self,
        body: GroupRequestSchema,
        session: AsyncSession = Depends(get_db),
    ):
        if not body.group:
            raise HTTPException(status_code=404, detail="group not found")
        await group_dao.delete_group(body, session)
        return {"message": "group created"}

    async def put(
        self,
        body: UpdateGroupRequestSchema,
        session: AsyncSession = Depends(get_db),
    ):
        if not (body.group and body.name):
            raise HTTPException(status_code=404, detail="group not found")
        await group_dao.update_group(body, session)
        return {"message": "group updated"}
