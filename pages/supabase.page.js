import { Orm } from "jsr:@xtool/mod";

const db = new Orm({
  user: Deno.env.get("SUPABASE_USER"),
  password: Deno.env.get("SUPABASE_PASSWORD"),
  hostname: Deno.env.get("SUPABASE_HOSTNAME"),
  CERT: Deno.env.get("SUPABASE_CERT"),
});

const res = await db.select().table("posts");
export default function* () {
  for (const article of res.rows) {
    article.date = article.created_at;  // Lume use date default
    article.content += "\n\n# 评论";
    yield {
      type: "post",
      layout: "post.vto",
      origin: "supabase",
      url: `/${article.category}/${article.title}/`,
      ...article
    };
  }
}