#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
git add .
read -t 30 -p '请输入commit信息:' commit_log 
git commit -m "$commit_log"

git remote add origin git@github.com:iStudyMen/lume-theme-blog.git || git push -u origin main