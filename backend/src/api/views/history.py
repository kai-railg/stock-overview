# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.access import qstock_access
from src.schema import HistoryRequestSchema


class HistoryView(BaseApiView):
    def get(self, body: HistoryRequestSchema):
        data = qstock_access.history_data(body.model_dump())
        return data
