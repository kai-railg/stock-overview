# -*- encoding: utf-8 -*-

from starlette.endpoints import WebSocketEndpoint

from src.aop import (
    clear_cache_decorator,
    get_cache_decorator,
    only_one_exec_decorate
)
from src.middleware import new_router
from src.api.views import *


router = new_router()

route_list = [
    ( "/api/qstock/realtime", RealtimeView, {"summary": "最新行情数据"}, ),
    ( "/api/qstock/intraday", IntradayView, {"summary": "日内成交数据"}, ),
    ( "/api/qstock/history", HistoryView, {"summary": "历史行情数据"}, ),
    ( "/api/qstock/billboard", BillBoardView, {"summary": "龙虎榜"}, ),
    ( "/api/qstock/ths-index-name", ThsIndexNameView, {"summary": "概念板块"}, ),
    ( "/api/qstock/ths-index-member", ThsIndexMemberView, {"summary": "概念板块成分股"}, ),
    ( "/api/qstock/ths-index-data", ThsIndexDataView, {"summary": "概念板块行情数据"}, ),
    #········
    ( "/api/stock/daily-overview", DailyOverviewView, {"summary": "当天概览"}, ),
    ( "/api/stock/group", GroupView, {"summary": "股票分组"}, ),
    ( "/api/stock/detail", DetailView, {"summary": "股票详情"}, ),
    ( "/api/stock/comment", CommentView, {"summary": "股票备注"}, ),
    #········
    ( "/api/script/init_stock", InitStockScriptView, {"summary": "初始化股票"}, ),
]

for path, cls, kw in route_list:
    if issubclass(cls, WebSocketEndpoint):
        router.add_websocket_route(path, cls)
    else:
        cls(**kw).as_view(path, router)
