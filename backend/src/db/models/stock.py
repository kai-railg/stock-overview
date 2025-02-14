#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : stock
# @Time          : 2025-02-08 20:53:32
"""
import json
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Column,
    String,
    Integer,
    Column, 
    Integer, 
    String, 
    Text,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import relationship

from .base import Base


class Stock(Base):
    """
    股票
    """

    __tablename__ = "stock"
    id = Column(Integer, primary_key=True, autoincrement=True)

    code = Column(String(20), unique=True, nullable=False)
    name = Column(String(20), nullable=False)
    market= Column(String(20), default="")
    notes = relationship("Note", back_populates="stock")

class Note(Base):
    """
    股票便签
    """
    __tablename__ = "note"
    id = Column(Integer, primary_key=True, autoincrement=True)
    note = Column(Text)
    date = Column(DateTime, default=datetime.now)
    stock_id = Column(Integer, ForeignKey('stock.id'))
    stock = relationship("Stock", back_populates="notes")

class Group(Base):
    """
    股票分组
    分组内的股票使用json存储股票信息,并维护特定状态
    需要通过stock_id获取股票便签
    """

    __tablename__ = "group"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    stock_info = Column(Text)

    def add_stock(self, stock: Stock):
        stock_dict = self.get_stock_info()
        if stock.id not in stock_dict:
            stock_dict[stock.id] = {
                "id": stock.id,
                "hidden": False,
                "name": stock.name,
                "code": stock.code
            }
            self.set_stock_info(stock_dict)

    def delete_stock(self, stock_id):
        stock_dict = self.get_stock_info()
        if stock_id in stock_dict:
            stock_dict.pop(stock_id)
            self.set_stock_info(stock_dict)

    def get_stock_info(self):
        if self.stock_info:
            return json.loads(self.stock_info)
        else:
            # {
            #     "id": stock.id,
            #     "hidden": False,
            #     "name": stock.name,
            #     "code": stock.code
            # }
            return {}
    def set_stock_info(self, stock_info):
        self.stock_info = json.dumps(stock_info)
