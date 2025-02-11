#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : qstock_access
# @Time          : 2025-02-07 21:01:54
"""
from typing import List, Dict

from pandas import DataFrame
import qstock as qs

class QstockAccess:
    def __init__(self):
        pass

    def realtime_data(self, code):
        df: DataFrame = qs.stock_realtime(code=code)
        return {
            "keys": df.keys().tolist(),
            "data": df.values.tolist(),
        }
    def intraday_data(self, code: str | List) -> Dict[str, List]:
        df: DataFrame = qs.intraday_data(code=code)
        return {
            # "keys": ["名称", "代码", "时间", "成交价", "成交量", "单数"],
            "keys": df.keys().tolist(),
            "data": df.values.tolist()
        }
        # for row in df.iloc:
        #     name = row["名称"]

    def history_data(self, code, start="", end=None, freq="d", fqt=1):
        df: DataFrame = qs.get_data(code, start, end, freq, fqt)
        return {
            # "keys": ["日期", "名称", "代码", "开盘价", "最高价", "最低价","收盘价", "成交量", "成交额", "换手率"],
            "keys": df.keys().tolist(),
            "data": df.values.tolist(),
        }

    def stock_billboard(self, code):
        df: DataFrame = qs.stock_billboard(code=code)
        # ['股票代码', '股票名称', '上榜日期', '收盘价', '涨跌幅', '换手率', '龙虎榜净买额', '流通市值', '上榜原因', '解读']
        return {
            "keys": df.keys().tolist(),
            "data": df.values.tolist(),
        }

    def ths_index_name(self, flag="概念") -> List[str]:
        """
        flag='概念板块' or '行业板块'
        """
        return qs.ths_index_name(flag)

    def ths_index_data(self, flag):
        df: DataFrame = qs.ths_index_data("有机硅概念")
        # ['open', 'high', 'low', 'close', 'volume']
        # [993.591, 1013.761, 974.0, 1003.961, 565868450.0]
        return {
            "keys": df.keys().tolist(),
            "data": df.values.tolist(),
        }

qstock_access = QstockAccess()
