# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView


class GroupView(BaseApiView):
    def get(self, body: dict):
        return
