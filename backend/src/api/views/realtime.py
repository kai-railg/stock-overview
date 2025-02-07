# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView


class RealtimeView(BaseApiView):
    def get(self, body: dict):
        return
