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
    ( "/api/qstock/realtime", RealtimeView, {"summary": "股票最新行情数据"}, ),
    ( "/api/qstock/intraday", IntradayView, {"summary": "股票日内成交数据"}, ),
    ( "/api/qstock/history", HistoryView, {"summary": "股票历史行情数据"}, ),
    ( "/api/qstock/billboard", BillBoardView, {"summary": "龙虎榜"}, ),
    ( "/api/qstock/ths-index-name", ThsIndexNameView, {"summary": "概念板块"}, ),
    ( "/api/qstock/ths-index-member", ThsIndexMemberView, {"summary": "概念板块成分股"}, ),
    ( "/api/qstock/ths-index-data", ThsIndexDataView, {"summary": "概念板块行情数据"}, ),
    #········
    ( "/api/stock/daily-overview", DailyOverviewView, {"summary": "当天概览"}, ),
    ( "/api/stock/groups", GroupsView, {"summary": "股票所有分组"}, ),
    ( "/api/stock/group/{group_name}", GroupView, {"summary": "股票分组"}, ),
    ( "/api/stock/group/{group_name}/{stock_iden}", GroupStockApiView, {"summary": "分组内股票管理"}, ),
    ( "/api/stock/{stock_iden}/detail", DetailView, {"summary": "股票详情"}, ),
    ( "/api/stock/notes", NotesView, {"summary": "股票所有便签"}, ),
    ( "/api/stock/notes/{stock_iden}", StockNotesView, {"summary": "股票所有便签"}, ),
    ( "/api/stock/note/{note_id}", StockNoteView, {"summary": "股票便签管理"}, ),
    #········
    ( "/api/script/init_stock", InitStockScriptView, {"summary": "初始化股票"}, ),
]

for path, cls, kw in route_list:
    if issubclass(cls, WebSocketEndpoint):
        router.add_websocket_route(path, cls)
    else:
        cls(**kw).as_view(path, router)
