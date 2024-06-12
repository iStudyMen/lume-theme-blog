最开始学JS时都是用 `NodeJS`，每次启动项目都是一堆`node_modules`，下载速度又慢，经常出错，简直就是狗屎!

我很庆幸遇到了`Deno`([Deno Land](https://deno.com/))，它给了我完美的体验。

以前也用`VuePress`做过博客，它的界面风格简约美观，但是因为背靠`NodeJS`，那些丑陋的问题依然存在。并且它有些设计理念我也不喜欢，这个时候很开心又遇见了`Lume`([Lume Land](https://lume.land/))。

# 一个简单的博客主题

主要是依据[Lume theme-simple-blog](https://github.com/lumeland/theme-simple-blog)来改写的，所以一样支持站内搜索（感觉`Tag`功能不实用删除了），主要改动如下：

- 基于`tailwindcss`
- 使用`typography`，增加了`代码高亮`，修改了`Table`样式等等
- 添加了`Lume-code`支持
- 添加了`Code`中的`Copy`按钮
- 根据`category`自动生成顶部导航
- 支持从`supabase`导入文章
- 支持评论功能，基于[utteranc](https://utteranc.es/)

# 使用主题

只要你启动一个`Lume`项目，修改`_config.ts`:

```ts
import lume from "lume/mod.ts";
import blog from "https://deno.land/x/lume_theme_blog/mod.ts";

const site = lume();
site.use(blog());
export default site;
```
