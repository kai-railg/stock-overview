from src.middleware.api_view import BaseApiView
from src.schema import DailyRespSchema, DailyRequSchema
from src.db.models import get_db
from src.db.dao import daily_dao

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


def get_data(daily):
    if not daily:
        return {}
    return DailyRespSchema.model_validate(daily).model_dump()

class DailisView(BaseApiView):
    async def get(self, session: AsyncSession = Depends(get_db)):
        dailies = await daily_dao.get_dailies(session)
        return {"data": [get_data(daily) for daily in dailies]}


class DailyView(BaseApiView):

    async def get(
        self, 
        date: str, 
        session: AsyncSession = Depends(get_db)
    ):
        daily = await daily_dao.get_daily(date, session)
        return {"data": get_data(daily)}

    async def post(
        self, 
        date: str,
        body: DailyRequSchema,
        session: AsyncSession = Depends(get_db)
    ):
        daily = await daily_dao.create_daily(
            date, body, session)
        return {
            "message": "success"
        }

    async def put(
        self, 
        date: str, 
        body: DailyRequSchema,
        session: AsyncSession = Depends(get_db)
    ):
        await daily_dao.update_daily(date, body, session)
        return {"message": "success" }

    async def delete(
        self, 
        date: str,
        session: AsyncSession = Depends(get_db)
    ):
        await daily_dao.delete_daily(date, session)
        return {"message": "success" }
