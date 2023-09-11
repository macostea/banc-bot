const fs = require('fs')
const cheerio = require('cheerio')

;(async () => {
  main()
})()

async function main() {
  console.log('Starting to scrape')

  const rawCategories = JSON.parse(
    fs.readFileSync('categories.json', 'utf8'),
  )
  const categories = rawCategories.map((category) => {
    const name = category[0]
      .replace('http://www.bancuri.net/Categoria_', '')
      .split('-')[0]
      .replaceAll('_', ' ')
    return {
      name: name,
      url: category[0],
      totalBancs: parseInt(category[1]),
    }
  })

  for (category of categories) {
    console.log('Scraping ' + category.name)
    fs.appendFileSync(
      'data.sql',
      `INSERT INTO categories (Name, Url, TotalBancs) SELECT '${category.name}', '${category.url}', '${category.totalBancs}' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE Url = '${category.url}');\n`,
    )

    const totalPages = Math.trunc((category.totalBancs - 1) / 20) + 1
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const pageUrl =
        category.url.replace('.htm', '') + '/pagina-' + pageNumber + '.htm'
      const page = await fetch(pageUrl)
      const pageText = await page.text()

      let $ = cheerio.load(pageText)

      const bancs = $('.S').map((_, element) => {
        return $(element)
          .text()
          .trim()
          .replaceAll('\n', '\\n')
          .replaceAll("'", "''")
      })

      for (const banc of bancs) {
        fs.appendFileSync(
          'data.sql',
          `INSERT INTO bancs (Text, CategoryId) SELECT '${banc}', (SELECT Id FROM categories WHERE Name = '${category.name}') WHERE NOT EXISTS (SELECT 1 FROM bancs WHERE Text = '${banc}');\n`,
        )
      }
    }
  }

  console.log('Finished scraping')
}
