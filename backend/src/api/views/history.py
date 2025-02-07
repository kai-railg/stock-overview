# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView


class HistoryView(BaseApiView):
    def get(self, body: dict):
        return
