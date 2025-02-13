# -*- encoding: utf-8 -*-


from src.middleware.api_view import BaseApiView


class CommentView(BaseApiView):
    def get(self, body: dict):
        return
