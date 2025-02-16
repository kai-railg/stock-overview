# -*- encoding: utf-8 -*-

import os
import sys

from loguru import logger

LOG_DIR = "./log"

logger.remove(0)
logger.add(sys.stderr, level="ERROR")
logger.add(f"{LOG_DIR}/console.log", level="DEBUG")


# 配置日志格式和级别
logger_config = dict(
    rotation="1 day",
    retention="45 days",
    # 更多格式设置指令 https://loguru.readthedocs.io/en/stable/api/logger.html#record
    # format="{time:YYYY-MM-DD > HH:mm:ss.SSS > zz WeekE} | {level} | {message}",
    format="[<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green>] | <level>{level: <4}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
,
    # 压缩格式
    compression="gz",
    # 采用布尔值，并确定是否应启用终端着色。
    colorize=True,
    # 如果设置为 True，则会导致日志记录以 JSON 格式显示。
    # 每条记录中的信息都将以键/值对的形式提供
    serialize=False,
    # 确定异常跟踪是否应延伸到捕获错误的点之外，以便更易于调试。
    backtrace=True,
    # 确定变量值是否应在异常跟踪中显示。在生产环境中，应将其设置为 False，以避免敏感信息泄露
    diagnose=False,
    # 默认情况下，添加到记录器的所有接收器都是线程安全的。它们不是多进程安全的.
    # 启用此选项会将日志记录置于队列中，以避免在多个进程记录到同一目标时发生冲突。
    enqueue=False,
    # 如果在记录到指定的接收器时发生意外错误，您可以通过将此选项设置为 True 来捕获该错误。错误将被打印为标准错误。
    catch=True
)

# bk: bind_kwargs
def get_logger(log_name: str, **kwargs):

    log_file = f"{LOG_DIR}/{log_name.strip('/')}.log"

    log_path = "/".join(log_file.split("/")[:-1])
    if not os.path.exists(log_path):
        os.makedirs(log_path, exist_ok=True)

    logger.add(
        log_file,
        filter=lambda record: record["extra"].get("log_name") == log_name, 
        **{**logger_config, **kwargs})

    return logger.bind(log_name=log_name)


# fastapi_log
f_log = get_logger("f_log")
request_post_log = get_logger("request_post")
request_get_log  = get_logger("request_get")


# 不同level
# logger.trace("A trace message.")
# logger.debug("A debug message.")
# logger.info("An info message.")
# logger.success("A success message.")
# logger.warning("A warning message.")
# logger.error("An error message.")
# logger.critical("A critical message.")

# 创建自定义级别
# logger.level("FATAL", no=60, color="<red>", icon="!!!")
# logger.log("FATAL", "A user updated some information.")

# 日志上下文
# childLogger = logger.bind(seller_id="001", product_id="123")
# childLogger.info("product page opened")
# childLogger.info("product updated")
# childLogger.info("product page closed")

# 记录错误
# with logger.catch():
#     50 / x
# 或者使用
# @logger.catch(level="ERROR", message="An error caught in test()")

# 集中和监控日志
# https://betterstack.com/logtail

# 更多信息
# https://betterstack.com/community/guides/logging/loguru/

if __name__ == "__main__":
    request_post_log.error("{request_post_log}")
    # request_get_log.info("new request /api/stock/groups: {'id': 4800837264, 'method': 'GET', 'param': dict_items([]), 'client': Address(host='127.0.0.1', port=59891)}")
