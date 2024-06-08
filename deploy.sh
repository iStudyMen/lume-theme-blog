#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
git add .
read -t 30 -p '请输入Commit信息:' commit_info
git commit -m "$commit_info"
read -t 30 -p '请输入Tag信息:' tag_name
git tag $tag_name

git remote add origin git@github.com:iStudyMen/lume-theme-blog.git || git push -u origin $tag_name