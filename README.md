# Simple Lume Blog Theme

[Lume](https://lume.land) theme to create a simple blog.

- Based tailwindcss.
- Instant search engine.
- - It supports `comments` powered by [utteranc](https://utteranc.es/).

# Install as a remote theme

The **fastest and easiest** way to use this theme is by importing it as a remote
module. It allows to create a blog in seconds and update it at any time just by
changing the version number in the import URL. Just add the following code to
your `_config.ts` file:

```ts
import lume from "lume/mod.ts";
import blog from "https://deno.land/x/lume_theme_blog/mod.ts";

const site = lume();
site.use(blog());
export default site;
```
