# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.db.models import Stock, get_db
from src.db.dao import stock_dao
from src.schema import NoteSchema, NoteSimpleSchema

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


class StockNoteView(BaseApiView):
    async def get(
        self,
        note_id: int, 
        session: AsyncSession = Depends(get_db),
    ):
        note = await stock_dao.get_node(note_id, session)
        data = {}
        if note:
            data = NoteSchema.model_validate(note).model_dump()
        return {"data": data}

    async def post(
        self,
        note_id: str | int,
        body: NoteSimpleSchema,
        session: AsyncSession = Depends(get_db),
    ):
        """
        受限于fastapi 路由参数, 此处的note_id实际为stock_id
        """
        stock_id = note_id
        await stock_dao.create_note(stock_id, body, session)
        return {"message": "success"}

    async def put(
        self,
        note_id: int,
        body: NoteSimpleSchema,
        session: AsyncSession = Depends(get_db),
    ):
        await stock_dao.update_note(note_id, body, session)
        return {"message": "success"}

    async def delete(
        self,
        note_id: int,
        session: AsyncSession = Depends(get_db),
    ):
        await stock_dao.delete_note(note_id, session)
        return {"message": "success"}
