#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : qstock_api_schema
# @Time          : 2025-02-08 20:07:10
"""
from typing import List, Dict

from pydantic import BaseModel

class QstockParamsBaseSchema(BaseModel):
    code: str | List

class RealtimeRequestSchema(QstockParamsBaseSchema):
    pass

class IntradayRequestSchema(QstockParamsBaseSchema):
    pass

class HistoryRequestSchema(QstockParamsBaseSchema):
    start: str = "19000101"
    end: str | None = None
    freq: str = (
        "d"  # 默认日，1 : 分钟；5 : 5 分钟；15 : 15 分钟；30 : 30 分钟； 60 : 60 分钟；101或'D'或'd'：日；102或‘w’或'W'：周; 103或'm'或'M': 月 注意1分钟只能获取最近5个交易日一分钟数据
    ) 
    fqt: int = 1  # 0：不复权，1：前复权；2：后复权，默认前复权
