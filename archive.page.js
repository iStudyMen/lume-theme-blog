export const layout = "archive.vto";
export const title = "Archive";
export const renderOrder = 10;

export default function* ({ search, paginate }) {
  const url = (n) => (n === 1) ? "/archive/" : `/archive/${n}/`;
  const posts = search.pages("type=post", "date=desc");  
  for (const data of paginate(posts, { url, size: 10 })) {
    if (data.pagination.page === 1) {    // Show the first page in the menu
      data.menu = {
        visible: true,
        order: 1,
      };
    }
    yield data;
  }

  const categorys = search.values("category");
  for(let i=0; i<categorys.length; i++) {
    let category = categorys[i];
    if(category == "Archive") continue;

    const url = (n) => (n === 1) ? `/${category}/` : `/${category}/${n}/`;
    const datas = search.pages(`category=${category}`, "date=desc");
    for (const data of paginate(datas, { url, size: 10 })) {
      if (data.pagination.page === 1) {    // Show the first page in the menu
        data.menu = {
          visible: true,
          order: 1,
        };
      }
      yield data;
    }
  }
}
