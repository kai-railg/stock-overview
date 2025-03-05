#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : note
# @Time          : 2025-02-22 10:29:48
"""
import enum
from datetime import datetime, timezone
from typing import List, Dict

from pydantic import BaseModel, ConfigDict, Field, model_serializer

class NoteSimpleSchema(BaseModel):
    note: str
    date: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).astimezone(None).replace(tzinfo=None)
    )


class NoteSchema(NoteSimpleSchema):
    id: int
    stock_id: int
    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)

    @model_serializer
    def model_ser(self) -> Dict:
        return {
            "id": self.id,
            "note": self.note,
            "date": datetime.strftime(self.date, "%Y-%m-%d %H:%M:%S"),
        }

class StockSchema(BaseModel):
    id: int
    code: str
    name: str
    market: str
    notes: List[NoteSchema]
    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)

    @model_serializer
    def model_ser(self) -> Dict:
        return {
            "name": self.name,
            "code": self.code,
            "id": self.id,
            "market": self.market,
        }

class DailyRequSchema(BaseModel):
    title: str
    content: str

class DailyRespSchema(BaseModel):
    date: str
    id: int
    title: str
    content: str
    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)


class DailyRequSchema(BaseModel):
    title: str
    content: str

class TradeType(enum.IntEnum):
    buy = 1
    sell = 2

class TradeRequSchema(BaseModel):
    trade_date: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
        .astimezone(None)
        .replace(tzinfo=None)
    )
    trade_type: TradeType
    price: int
    volume: int
    fee: float = 0.0002
    reason: str
    stock_iden: str | int

class TradeRespSchema(BaseModel):
    id: int
    trade_date: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).astimezone(None).replace(tzinfo=None)
    )
    trade_type: TradeType
    price: int
    volume: int
    fee: float
    returns: int
    reason: str
    stock_id: int

    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)

class MonitorPriceSchema(BaseModel):
    price: float
    note: str

class MonitorRequSchema(BaseModel):
    code: str
    name: str = ''
    details: List[MonitorPriceSchema]
