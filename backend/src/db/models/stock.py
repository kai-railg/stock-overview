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
    DateTime,
    Table,
    Float
)
from sqlalchemy.orm import relationship

from .base import Base

stock_board_association = Table(
    "stock_board",
    Base.metadata,
    Column("stock_id", Integer, ForeignKey("stock.id"), primary_key=True),
    Column("board_id", Integer, ForeignKey("board.id"), primary_key=True),
)


class Stock(Base):
    """
    股票
    """

    __tablename__ = "stock"
    id = Column(Integer, primary_key=True, autoincrement=True)

    code = Column(String(20), unique=True, nullable=False)
    name = Column(String(20), nullable=False)
    market= Column(String(20), default="") # SZ; SH
    notes = relationship("Note", back_populates="stock")
    trades = relationship("Trade", back_populates="stock")

    # 多对多关系
    boards = relationship(
        "Board",
        secondary=stock_board_association,
        back_populates="stocks",
        lazy="dynamic",  # 启用动态加载
    )

class Board(Base):
    """
    行业概念板块
    """
    __tablename__ = "board"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False)
    type = Column(String(20), default="")
    # 反向多对多关系
    stocks = relationship(
        "Stock",
        secondary=stock_board_association,
        back_populates="boards",
        cascade="save-update, merge",  # 级联设置
    )
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


class Daily(Base):
    """
    每日总结
    """

    __tablename__ = "daily"
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(String(20), unique=True, nullable=False, index=True)
    title = Column(String(100))
    content = Column(Text)


class Trade(Base):
    """
    股票交易记录
    """

    __tablename__ = "trade"
    id = Column(Integer, primary_key=True, autoincrement=True)

    trade_date = Column(DateTime, default=datetime.now)
    trade_type = Column(Integer)  # "交易类型: 1买, 2卖"

    price = Column(Integer) # "交易价格"
    volume = Column(Integer)  # 交易数量
    fee = Column(Float, default=0.0002)  # 交易手续费比例
    returns = Column(Integer, default=0) # 本次收益
    reason = Column(String(300)) # 交易原因

    stock_id = Column(Integer, ForeignKey("stock.id"))
    stock = relationship("Stock", back_populates="trades")
