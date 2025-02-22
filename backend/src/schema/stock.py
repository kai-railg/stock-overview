#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : note
# @Time          : 2025-02-22 10:29:48
"""

from datetime import datetime, timezone
from typing import List, Dict

from pydantic import BaseModel, ConfigDict, Field

class NoteSimpleSchema(BaseModel):
    note: str
    date: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).astimezone(None).replace(tzinfo=None)
    )


class NoteSchema(NoteSimpleSchema):
    id: int
    stock_id: int
    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)


class StockSchema(BaseModel):
    id: int
    code: str
    name: str
    market: str
    notes: List[NoteSchema]
    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)
