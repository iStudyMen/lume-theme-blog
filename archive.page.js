export const layout = "archive.vto";
export const title = "Archive";

export default function* ({ search, paginate }) {
  const url = (n) => (n === 1) ? "/archive/" : `/archive/${n}/`;
  const posts = search.pages("type=post", "date=desc");

  for (
    const data of paginate(posts, { url, size: 10 })
  ) {
    // Show the first page in the menu
    if (data.pagination.page === 1) {
      data.menu = {
        visible: true,
        order: 1,
      };
    }

    yield data;
  }
}
