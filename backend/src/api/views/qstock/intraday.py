# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView
from src.access import qstock_access
from src.db.dao import stock_dao


class IntradayView(BaseApiView):

    def get(self, stock_iden: str):
        stock = stock_dao.get_stock(stock_iden)
        data = qstock_access.intraday_data(stock_iden)
        return data
