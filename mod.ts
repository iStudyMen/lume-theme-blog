import date, { Options as DateOptions } from "lume/plugins/date.ts";
import terser from "lume/plugins/terser.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import metas from "lume/plugins/metas.ts";
import pagefind, { Options as PagefindOptions } from "lume/plugins/pagefind.ts";
import sitemap from "lume/plugins/sitemap.ts";
import feed, { Options as FeedOptions } from "lume/plugins/feed.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import { merge } from "lume/core/utils/object.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import image from "https://deno.land/x/lume_markdown_plugins@v0.7.0/image.ts";
import "lume/types.ts";

// CSS、Markdown、Highlight
import postcss from "lume/plugins/postcss.ts";
import prism, { Options as PrismOptions } from "lume/plugins/prism.ts";
import "npm:prismjs@1.29.0/components/prism-git.min.js";
import "npm:prismjs@1.29.0/components/prism-typescript.min.js";
import "npm:prismjs@1.29.0/components/prism-bash.min.js";
import { alert } from "npm:@mdit/plugin-alert@0.8.0";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import typography from "npm:@tailwindcss/typography";

export interface Options {
  prism?: Partial<PrismOptions>;
  date?: Partial<DateOptions>;
  pagefind?: Partial<PagefindOptions>;
  feed?: Partial<FeedOptions>;
}

export const defaults: Options = {
  feed: {
    output: ["/feed.xml", "/feed.json"],
    query: "type=post",
    info: {
      title: "=metas.site",
      description: "=metas.description",
    },
    items: {
      title: "=title",
    },
  },
};

/** Configure the site */
export default function (userOptions?: Options) {
  const options = merge(defaults, userOptions);

  return (site: Lume.Site) => {
    const files = [
      "favicon.ico",
      "js/main.js",
      "js/comp_lume_code.js",
      "css/prism.css",
      "css/styles.css",
      "_data.json",
      "_includes/archive.vto",
      "_includes/post.vto",
      "_includes/base.vto",
      "index.vto",
      "404.vto",
      "contact.vto",
      "archive.page.js",      
    ];

    for (const file of files) {
      site.remoteFile(file, import.meta.resolve(`./${file}`));
    }

    site
      // .ignore("lume-theme-blog")
      .use(tailwindcss({
        extensions: [".html", ".jsx"],
        options: {
          theme: {
            extend: {
              typography: {
                DEFAULT: {
                  css: {
                    'code::before': {
                      content: 'normal',
                    },
                    'code::after': {
                      content: 'normal',
                    },
                    'h1,h2,h3': {
                      "padding-bottom": ".6rem",
                      "border-bottom": "1px solid #e2e8f0",
                    },
                    'a': {
                      "color": "#3eaf7c",
                      "padding":"0.2rem 0.4rem",
                      "text-decoration": "none"
                    },
                    'a:after': { 
                      "content": "→",
                      "display": "inline-block",
                    },
                    'a:hover': {
                      "text-decoration": "underline"
                    },
                  },
                },
              },
            },
          },

          plugins: [
            typography,
            function ({addVariant}) {
              addVariant( 
                'prose-inline-code',
                '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))'
              );
              addVariant( 
                'prose-table-tr',
                '&.prose :where(tr:nth-child(even)):not(:where([class~="not-prose"] *))'
              );
            }
          ],
        },
      }))
      .use(postcss())
      .use(basePath())
      .use(toc())
      .use(prism(options.prism))
      .use(readingInfo())
      .use(date(options.date))
      .use(metas())
      .use(image())
      .use(resolveUrls())
      .use(slugifyUrls())
      .use(terser())
      .use(pagefind(options.pagefind))
      .use(sitemap())
      .use(feed(options.feed))
      .mergeKey("extra_head", "stringArray")
      .process([".html"], (pages) => {
          for (const page of pages) {
            const doc = page.document!;
            const blocks = doc.querySelectorAll("lume-code");

            blocks.forEach((block, i) => {
              const pres = block.querySelectorAll(
                ":scope > pre",
              );

              const menu = doc.createElement("ul");
              menu.setAttribute("role", "tablist");
              menu.setAttribute("aria-label", "Code Tabs");
              menu.classList.add("lume-code-menu");

              pres.forEach((pre, j) => {
                const title = pre.querySelector("code")!.getAttribute("title")!;

                const li = doc.createElement("li");
                li.setAttribute("role", "presentation");

                const button = doc.createElement("button");
                button.setAttribute("role", "tab");
                button.setAttribute("aria-selected", j === 0 ? "true" : "false");
                button.setAttribute("aria-controls", `panel-${i + 1}-${j + 1}`);
                button.setAttribute("id", `tab-${i + 1}-${j + 1}`);
                button.setAttribute("tabindex", j === 0 ? "0" : "-1");
                button.innerText = title;
                button.classList.add("lume-code-tab");

                if (j > 0) {
                  pre.setAttribute("hidden", "true");
                } else {
                  button.classList.add("is-active");
                }

                pre.setAttribute("role", "tabpanel");
                pre.setAttribute("aria-labelledby", `tab-${i + 1}-${j + 1}`);
                pre.setAttribute("id", `panel-${i + 1}-${j + 1}`);
                pre.setAttribute("tabindex", "0");

                li.append(button);
                menu.appendChild(li);
              });

              (block as unknown as HTMLElement).prepend(menu as unknown as Node);
            });
          }
        })


    // Markdown-it plugin
    site.hooks.addMarkdownItPlugin(alert);
  };
}
