#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : qstock_access
# @Time          : 2025-02-07 21:01:54
"""

import qstock as qs

class QstockAccess:
    def __init__(self):
        pass

    def realtime_data(self, code):
        df = qs.stock_realtime(code=code)

    def intraday_data(self, code):
        df = qs.intraday_data(code=code)
        return {
            "keys": ["名称", "代码", "时间", "成交价", "成交量", "单数"],
            "data": df.values.tolist()
        }
        # for row in df.iloc:
        #     name = row["名称"]
        #     code = row["代码"]
        #     time = row["时间"]
        #     price = row["成交价"]
        #     volume = row["成交量"]
        #     number = row["单数"]

    def get_data(self, code):
        df = qs.get_data(code=code)

    def stock_billboard(self, code):
        df = qs.stock_billboard(code=code)
