# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.db.models import Stock, get_db
from src.db.dao import stock_dao
from src.schema import StockSchema, NoteSchema

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


class StockNotesView(BaseApiView):
    async def get(
        self,
        stock_iden: str | None,
        session: AsyncSession = Depends(get_db),
    ):
        stock = await stock_dao.get_stock(stock_iden, session)
        data = (
            StockSchema.model_validate(stock).model_dump()
        )
        data['notes'] = [NoteSchema.model_validate(note).model_dump() for note in stock.notes]
        return {"data": data}


class NotesView(BaseApiView):
    async def get(
        self,
        session: AsyncSession = Depends(get_db),
    ):
        notes = await stock_dao.get_notes(session)
        result = []

        for note in notes:
            result.append({
                **NoteSchema.model_validate(note).model_dump(),
                "stock": {
                    "name": note.stock.name,
                    "code": note.stock.code,
                    "id": note.id,
                    "market": note.stock.market,
                },
                
            })
        return {"data": result}
