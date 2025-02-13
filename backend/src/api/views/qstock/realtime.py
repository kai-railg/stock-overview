# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.access import qstock_access
from src.schema import RealtimeRequestSchema


class RealtimeView(BaseApiView):

    def get(self, body: RealtimeRequestSchema):
        data = qstock_access.realtime_data(body.code)
        return data
