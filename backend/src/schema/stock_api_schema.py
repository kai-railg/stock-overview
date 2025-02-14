#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : stock_api_schema
# @Time          : 2025-02-08 20:42:22
"""

from typing import List, Dict

from pydantic import BaseModel, model_validator, ConfigDict


class StockRequestSchema(BaseModel):
    code: str = ""
    name: str = ""
    tag: str = ""
    group: str

    @model_validator(mode="before")
    @classmethod
    def at_least_one_field_required(cls, data):
        if not isinstance(data, dict):
            raise ValueError("Invalid data format")
        if not data.get("code") and not data.get("name"):
            raise ValueError("At least one of 'code' or 'name' must be provided")
        return data


class GroupStockPutSchema(StockRequestSchema):
    hidden: bool = False


class GroupRequestSchema(BaseModel):
    group: str = ""
    
class UpdateGroupRequestSchema(GroupRequestSchema):
    group: str
    name: str