#!/bin/bash

python3 -m src.db.migrations.reset_version

rm -rf ./src/db/migration/versions/*

alembic stamp head
alembic revision --autogenerate # 根据模型生成迁移脚本
alembic upgrade head # 执行迁移脚本，将模型真正映射到数据库, ps:如果要降级，使用 `alembic downgrade head` 命令
