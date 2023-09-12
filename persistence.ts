export type Category = {
  name: string;
  url: string;
  totalBancs: number;
};

export type Banc = {
  text: string;
  categoryName: string;
};

export async function addCategory(db: D1Database, category: Category) {
  return await db.prepare("INSERT INTO categories (Name, Url, TotalBancs) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM categories WHERE Url = ?)")
      .bind(category.name, category.url, category.totalBancs, category.url)
      .run();
}

export async function addBanc(db: D1Database, banc: Banc) {
  return await db.prepare("INSERT INTO bancs (Text, CategoryId) SELECT ?, (SELECT Id FROM categories WHERE Name = ?) WHERE NOT EXISTS (SELECT 1 FROM bancs WHERE Text = ?)")
      .bind(banc.text, banc.categoryName, banc.text)
      .run();
}

export async function getRandomBanc(d1: D1Database) {
  const banc = await d1.prepare("SELECT b.Text as text, c.Name AS categoryName FROM bancs b JOIN categories c ON b.CategoryId = c.Id ORDER BY RANDOM() LIMIT 1").first() as Banc;
  banc.text = banc.text.replaceAll("\\n", "\n").replaceAll("''", "'");

  return banc;
}

export async function getCategories(d1: D1Database) {
  return (await d1.prepare("SELECT Name as name, Url as url, TotalBancs as totalBancs FROM categories").all()).results as Category[];
}

export async function getBancFromCategory(d1: D1Database, categoryName: string) {
  const banc = await d1.prepare("SELECT b.Text as text, c.Name AS categoryName FROM bancs b JOIN categories c ON b.CategoryId = c.Id WHERE upper(c.Name) = upper(?) ORDER BY RANDOM() LIMIT 1")
    .bind(categoryName)
    .first() as Banc;

  if (!banc) {
    return null;
  }

  banc.text = banc.text.replaceAll("\\n", "\n").replaceAll("''", "'");

  return banc;
}
