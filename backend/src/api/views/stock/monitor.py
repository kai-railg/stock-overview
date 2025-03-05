# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.schema import MonitorRequSchema
from src.db.dao import stock_dao
from src.db import redis_db
from src.db.models import get_db
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import HTTPException, Depends

key = "stock-overview-monitor"

class StockMonitorView(BaseApiView):

    async def get(
        self,
    ):
        data = await redis_db.hgetall(key)
        if not data:
            return {"data": []}
        result = []
        for code, v in data.items():
            result.append(MonitorRequSchema.model_validate_json(v))
        # MonitorRequSchema.model_validate_json(data)
        return {"data": result}

    async def post(
        self,
        body: MonitorRequSchema,
        session: AsyncSession = Depends(get_db),
    ):
        stock = await stock_dao.get_stock(body.code or body.name, session)
        if not stock:
            raise HTTPException(status_code=404, detail="stock not found")
        body.name = stock.name
        body.code = stock.code
        await redis_db.hset(key, stock.code, body.model_dump_json())
        return {"message": "success"}

    async def put(
        self,
        session: AsyncSession = Depends(get_db),
    ):
        await stock_dao.update_note(note_id, body, session)
        return {"message": "success"}

    async def delete(
        self,
    ):
        await stock_dao.delete_note(note_id, session)
        return {"message": "success"}
