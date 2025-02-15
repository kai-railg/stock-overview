# -*- encoding: utf-8 -*-

from src.middleware.api_view import BaseApiView
from src.db.models import Stock, get_db
from src.db.dao import group_dao
from src.access import qstock_access

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


class GroupsView(BaseApiView):

    async def get(
        self,
        session: AsyncSession = Depends(get_db),
    ):
        groups = await group_dao.get_all_groups(session)
        return {"data": [{"name": group.name, "id": group.id} for group in groups]}
