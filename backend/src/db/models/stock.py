#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
# @FileName      : stock
# @Time          : 2025-02-08 20:53:32
"""

from sqlalchemy import (
    BigInteger,
    Column,
    String,
    Integer,
    Column, 
    Integer, 
    String, 
    ForeignKey, 
    Table
)
from sqlalchemy.orm import relationship

from .base import Base


association_table = Table(
    "association",
    Base.metadata,
    Column("stock_id", Integer, ForeignKey("stock.id")),
    Column("group_id", Integer, ForeignKey("group.id")),
)

class Stock(Base):
    """
    点位表
    """

    __tablename__ = "stock"
    id = Column(Integer, primary_key=True, autoincrement=True)

    code = Column(String(20), unqique=True, nullable=False)
    name = Column(String(20), unqique=True, nullable=False)
    tag = Column(String(20), default="")

    groups = relationship("Group", secondary=association_table, back_populates="stocks")


class Group(Base):
    __tablename__ = "group"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)

    stocks = relationship("Stock", secondary=association_table, back_populates="groups")
