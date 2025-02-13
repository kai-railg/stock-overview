# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.access import qstock_access
from src.schema import IntradayRequestSchema


class IntradayView(BaseApiView):

    def get(self, body: IntradayRequestSchema):
        data = qstock_access.intraday_data(body.code)
        return data
