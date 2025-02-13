#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : pywencai_access
# @Time          : 2025-02-13 19:47:44
"""

from typing import List, Dict

from pandas import DataFrame
import pywencai


class PywencaiAccess:
    def __init__(self):
        pass
    
    def custom_query(self, query: str, loop=True):
        """
        自定义查询
        """
        return pywencai.get(query=query, loop=loop)
    
pywencai_access = PywencaiAccess()