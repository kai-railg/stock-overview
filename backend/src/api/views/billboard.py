# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.access import qstock_access

class BillBoardView(BaseApiView):
    def get(self):
        data = qstock_access.stock_billboard()
        return data
