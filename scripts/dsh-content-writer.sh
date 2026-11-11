#!/bin/bash
# sougakuhikaku.com 週次記事ライティング（DSH headless / zai glm-5.3-flash）
# launchd: com.sougakuhikaku.dsh-content-writer から週2回（月・木 10:00 JST）起動
set -u

REPO="/Volumes/MOVESPEED/Documents/GitHub/korea-affiliate-media"
LOG_DIR="$REPO/var/logs"
PROMPT_FILE="$REPO/scripts/content-writer-prompt.md"
RUN_LOG="$LOG_DIR/dsh-content-writer-$(date +%Y-%m-%d-%H%M).log"
mkdir -p "$LOG_DIR"

# 認証情報の引き込み（優先順位: 環境変数 → launchctl → ~/.dsh/.credentials.yaml の refs）
if [ -z "${ZAI_API_KEY:-}" ]; then
  export ZAI_API_KEY="$(launchctl getenv ZAI_API_KEY 2>/dev/null)"
fi
if [ -z "${ZAI_API_KEY:-}" ] && [ -f "$HOME/.dsh/.credentials.yaml" ]; then
  export ZAI_API_KEY="$(node -e '
    const fs=require("fs");
    const src=fs.readFileSync(process.env.HOME+"/.dsh/.credentials.yaml","utf8");
    const m=src.match(/^  ZAI_API_KEY:\s*(\S+)\s*$/m);
    if(m) process.stdout.write(m[1]);
  ')"
fi

if [ -z "${ZAI_API_KEY:-}" ]; then
  echo "FATAL: ZAI_API_KEY が見つかりません（launchctl getenv / 環境変数のいずれにも未設定）" | tee -a "$RUN_LOG"
  exit 1
fi

{
  echo "=== dsh content-writer run: $(date '+%Y-%m-%d %H:%M:%S %Z') ==="
  cd "$REPO" || exit 1
  dsh --profile content-writer headless \
    "scripts/content-writer-prompt.md の指示に従って、今回分の韓国旅行記事を1本生成してください。プロンプトファイルを必ず最初に読んでください。"
  code=$?
  echo "=== exit code: $code / $(date '+%Y-%m-%d %H:%M:%S %Z') ==="
} >> "$RUN_LOG" 2>&1

# ログが肥大しないよう30日より古い実行ログを削除
find "$LOG_DIR" -name "dsh-content-writer-*.log" -mtime +30 -delete
