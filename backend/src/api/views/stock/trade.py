from src.middleware.api_view import BaseApiView
from src.schema import TradeRespSchema, TradeRequSchema, TradeType
from src.db.models import get_db
from src.db.dao import trade_dao, stock_dao

from fastapi import HTTPException, Depends

from sqlalchemy.ext.asyncio import AsyncSession


def get_data(trade):
    if not trade:
        return {}
    result = TradeRespSchema.model_validate(trade).model_dump()

    # result["stock"] = StockSchema.model_validate(trade.stock).model_dump()
    result["stock"] = {
        "name": trade.stock.name,
        "code": trade.stock.code,
        "id": trade.stock.id,
        "market": trade.stock.market
    }
    return result


class StockTradesView(BaseApiView):
    async def get(self, session: AsyncSession = Depends(get_db)):
        trades = await trade_dao.get_trades(session)
        return {"data": [get_data(trade) for trade in trades]}


class StockTradePostView(BaseApiView):

    async def post(
        self, body: TradeRequSchema, session: AsyncSession = Depends(get_db)
    ):
        stock = await stock_dao.get_stock(body.stock_iden, session)
        returns: float = -(body.price * body.volume * body.fee)
        if body.trade_type == TradeType.sell.value:
            returns += await self.get_returns(body.price, body.volume, session)

        trade = await trade_dao.create_trade(body, stock.id, returns, session)
        return {"message": "success"}

    async def get_returns(self, price: float, volume: int, session):
        # 当前为卖单的时候，需要计算收益
        # 倒序遍历交易记录, 知道找到成本买单，并且买单的数量不小于卖单
        returns = 0
        sell_volume = 0
        for trade in await trade_dao.get_trades(session):
            # 匹配到卖单
            if trade.trade_type == TradeType.sell.value:
                sell_volume += trade.volume
            # 匹配到买单
            elif trade.trade_type == TradeType.buy.value:
                # 买单的成本已被计算过
                if trade.volume <= sell_volume:
                    sell_volume -= trade.volume
                    continue
                exact_vol = trade.volume - sell_volume
                sell_volume = 0
                # 买单部分匹配卖单
                if exact_vol <= volume:
                    returns += (price - trade.price) * exact_vol
                    volume -= exact_vol
                else:
                    returns += (price - trade.price) * volume
                    volume = 0
            if volume == 0:
                break
        return returns
class StockTradeView(BaseApiView):

    async def get(self, trade_id: int, session: AsyncSession = Depends(get_db)):
        trade = await trade_dao.get_trade(trade_id, session)
        return {"data": get_data(trade)}

    async def put(
        self, trade_id: int, body: TradeRequSchema, session: AsyncSession = Depends(get_db)
    ):
        stock = await stock_dao.get_stock(body.stock_iden, session)
        await trade_dao.update_trade(trade_id, body, stock.id, session)
        return {"message": "success"}

    async def delete(self, trade_id: int, session: AsyncSession = Depends(get_db)):
        await trade_dao.delete_trade(trade_id, session)
        return {"message": "success"}
