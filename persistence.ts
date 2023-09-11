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
