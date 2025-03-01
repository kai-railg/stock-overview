#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : qstock_access
# @Time          : 2025-02-07 21:01:54
"""
import datetime
from typing import List, Dict

import akshare as ak
from pandas import DataFrame

class QstockAccess:
    def __init__(self):
        pass

    def board(self):
        """
        全市场行情
        """
        df = ak.stock_zh_a_spot_em()
        result = []
        for row in df.iloc:
            {
            "序号": 1,
            "代码": "920106",
            "名称": "林泰新材",
            "最新价": 91.0,
            "涨跌幅": 30.0,
            "涨跌额": 21.0,
            "成交量": 21655.0,
            "成交额": 188371615.7,
            "振幅": 27.86,
            "最高": 91.0,
            "最低": 71.5,
            "今开": 72.5,
            "昨收": 70.0,
            "量比": 1.73,
            "换手率": 17.89,
            "市盈率-动态": 33.58,
            "市净率": 8.23,
            "总市值": 3628852500.0,
            "流通市值": 1101622795.0,
            "涨速": 0.0,
            "5分钟涨跌": 0.0,
            "60日涨跌幅": 359.13,
            "年初至今涨跌幅": 51.67,
        }
            data = row.to_dict()
            data["成交额"] = data["成交额"] / (10000 * 10000)
            data["总市值"] = data["总市值"] / (10000 * 10000)
            data["流通市值"] = data["流通市值"] / (10000 * 10000)
            result.append(data)
        return result
    def realtime_data(
        self,
        code,
    ):
        {
            # sell_5 30.74
            # sell_5_vol 72300.0
            # sell_4 30.73
            # sell_4_vol 3500.0
            # sell_3 30.72
            # sell_3_vol 35600.0
            # sell_2 30.71
            # sell_2_vol 90200.0
            # sell_1 30.7
            # sell_1_vol 386400.0
            # buy_1 30.69
            # buy_1_vol 80200.0
            # buy_2 30.68
            # buy_2_vol 119600.0
            # buy_3 30.67
            # buy_3_vol 18300.0
            # buy_4 30.66
            # buy_4_vol 116700.0
            # buy_5 30.65
            # buy_5_vol 54300.0
            # 最新 30.69
            # 均价 32.16
            # 涨幅 -4.98
            # 涨跌 -1.61
            # 总手 929574.0
            # 金额 2989753873.22
            # 换手 13.9
            # 量比 0.72
            # 最高 33.3
            # 最低 30.52
            # 今开 32.0
            # 昨收 32.3
            # 涨停 38.76
            # 跌停 25.84
            # 外盘 443118.0
            # 内盘 486456.0
        }
        result = {}
        need_keys = [
            "最新",
            "涨幅",
            "金额",
            "换手",
            "量比",
            "最高",
            "最低",
            "今开",
            "昨收",
            "涨停",
            "跌停",
            "外盘",
            "内盘",
        ]

        for row in ak.stock_bid_ask_em(symbol=code).iloc:
            if row['item'] in need_keys:
                result[row['item']] = row['value']
        try: 
            result["金额"] = round(float(result["金额"]) / (10000 * 10000), 2)
        except:
            pass
        return result

    def intraday_data(self, code: str | List) -> Dict[str, List]:
        result = []
        return result

    def history_data(
        self, code, period="daily", start="19700101", end="20250101", adjust="qfq"
    ):

        df: DataFrame = ak.stock_zh_a_hist(code, period, start, end, adjust)
        result = []
        for row in df.iloc:
            data = row.to_dict()
            data["成交额"] = float(data["成交额"]) / (10000 * 10000)
            data["日期"] = data["日期"].strftime("%Y-%m-%d")
            result.append(data)
            {
                "日期": datetime.date(2013, 3, 1),
                "股票代码": "000001",
                "开盘": 5.58,
                "收盘": 5.62,
                "最高": 5.69,
                "最低": 5.37,
                "成交量": 1037824,
                "成交额": 2371270416.0,
                "振幅": 5.71,
                "涨跌幅": 0.36,
                "涨跌额": 0.02,
                "换手率": 3.34,
            }
        return result

    def stock_billboard(self, code):
        df: DataFrame = qs.stock_billboard(code=code)
        # ['股票代码', '股票名称', '上榜日期', '收盘价', '涨跌幅', '换手率', '龙虎榜净买额', '流通市值', '上榜原因', '解读']
        return {
            "keys": df.keys().tolist(),
            "data": df.values.tolist(),
        }

    def market_activity(self):
        """
        市场情绪，赚钱效应分析
        """
        df = ak.stock_market_activity_legu()
        # 上涨 515.0
        # 涨停 52.0
        # 真实涨停 44.0
        # st st*涨停 8.0
        # 下跌 4568.0
        # 跌停 52.0
        # 真实跌停 49.0
        # st st*跌停 5.0
        # 平盘 36.0
        # 停牌 12.0
        # 活跃度 10.04%
        # 统计日期 2025-02-28 15:00:00
        result = {}
        for row in df.iloc:
            result[row["item"]] = row["value"]
        return result

qstock_access = QstockAccess()
