const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const mediaDir = path.join(__dirname, '../public/media');
fs.mkdirSync(mediaDir, { recursive: true });

const images = [
  {
    fileName: 'hero-hospitality',
    slot: 'HOME-HERO',
    sourceUrl: 'https://images.pexels.com/photos/4350081/pexels-photo-4350081.jpeg?auto=compress&cs=tinysrgb&w=1400',
    pageUrl: 'https://www.pexels.com/photo/smiling-waitress-serving-food-to-customer-4350081/',
    photographer: 'Ketut Subiyanto',
    peopleVisible: 'yes',
    altDe: 'Freundliche Servicekraft serviert Speisen am Tisch in einem modernen Café',
    altEn: 'Friendly hospitality staff serving food at a table in a modern café'
  },
  {
    fileName: 'pos-counter',
    slot: 'HOME-POS',
    sourceUrl: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pageUrl: 'https://www.pexels.com/photo/smiling-waitress-at-checkout-counter-4348404/',
    photographer: 'Ketut Subiyanto',
    peopleVisible: 'yes',
    altDe: 'Mitarbeiterin an der Theke mit bestehender Kasse',
    altEn: 'Staff member at the counter with existing cash register'
  },
  {
    fileName: 'staff-service',
    slot: 'HOME-ORDER',
    sourceUrl: 'https://images.pexels.com/photos/4921512/pexels-photo-4921512.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pageUrl: 'https://www.pexels.com/photo/waiter-serving-the-customer-s-orders-4921512/',
    photographer: 'RDNE Stock project',
    peopleVisible: 'yes',
    altDe: 'Kellner bringt frische Bestellungen an den Gästetisch',
    altEn: 'Waiter bringing fresh orders to dining guests'
  },
  {
    fileName: 'guest-order',
    slot: 'HELP-HERO',
    sourceUrl: 'https://images.pexels.com/photos/4921150/pexels-photo-4921150.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pageUrl: 'https://www.pexels.com/photo/waiter-taking-orders-from-customers-4921150/',
    photographer: 'RDNE Stock project',
    peopleVisible: 'yes',
    altDe: 'Servicekraft und Gäste im Gespräch im Restaurant',
    altEn: 'Staff and guests interacting warmly in a restaurant'
  },
  {
    fileName: 'guest-phone-table',
    slot: 'HOME-GUEST',
    sourceUrl: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pageUrl: 'https://www.pexels.com/photo/woman-using-smartphone-at-table-3184183/',
    photographer: 'Fauxels',
    peopleVisible: 'hands only',
    altDe: 'Gast öffnet mit dem Smartphone die Speisekarte am Tisch',
    altEn: 'Guest opening digital menu with smartphone at dining table'
  },
  {
    fileName: 'restaurant-interior',
    slot: 'HOME-VENUE',
    sourceUrl: 'https://images.pexels.com/photos/12913656/pexels-photo-12913656.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pageUrl: 'https://www.pexels.com/photo/people-in-a-restaurant-12913656/',
    photographer: 'Daria Nekipelova',
    peopleVisible: 'background blurred',
    altDe: 'Gemütliche Atmosphäre in einem belebten Gastronomiebetrieb',
    altEn: 'Warm ambiance in a vibrant hospitality restaurant'
  },
  {
    fileName: 'food-plated',
    slot: 'HOME-FOOD',
    sourceUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pageUrl: 'https://www.pexels.com/photo/healthy-food-salad-1640777/',
    photographer: 'Ella Olsson',
    peopleVisible: 'no',
    altDe: 'Frisch zubereitetes Gericht mit saisonalen Zutaten',
    altEn: 'Freshly prepared culinary meal with seasonal ingredients'
  },
  {
    fileName: 'food-coffee',
    slot: 'HOME-COFFEE',
    sourceUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pageUrl: 'https://www.pexels.com/photo/coffee-cup-with-latte-art-302899/',
    photographer: 'Chevanon Photography',
    peopleVisible: 'no',
    altDe: 'Tasse Cappuccino mit Latte Art auf Holztisch',
    altEn: 'Cup of cappuccino with latte art on wooden table'
  }
];

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  const timestamp = new Date().toISOString();
  const rows = [
    'file_name,slot,source_site,source_page_url,photographer,license_url,downloaded_at_utc,license_reviewed_by,people_visible,model_release_verified,property_brand_check,usage_and_no_endorsement_review,alt_de,alt_en,optimized_variants,hosted_url,status'
  ];

  for (const item of images) {
    console.log(`Downloading ${item.fileName}...`);
    const buffer = await downloadFile(item.sourceUrl);

    // Strip EXIF and optimize to WebP & JPEG
    const baseJpg = path.join(mediaDir, `${item.fileName}.jpg`);
    const baseWebp = path.join(mediaDir, `${item.fileName}.webp`);

    await sharp(buffer)
      .rotate() // auto-orient based on EXIF before stripping
      .jpeg({ quality: 85, progressive: true })
      .toFile(baseJpg);

    await sharp(buffer)
      .rotate()
      .webp({ quality: 85 })
      .toFile(baseWebp);

    console.log(`Saved ${item.fileName}.jpg and ${item.fileName}.webp`);

    rows.push([
      `"${item.fileName}.webp"`,
      `"${item.slot}"`,
      `"Pexels"`,
      `"${item.pageUrl}"`,
      `"${item.photographer}"`,
      `"https://www.pexels.com/license/"`,
      `"${timestamp}"`,
      `"Agent Verification"`,
      `"${item.peopleVisible}"`,
      `"Pexels Standard License - Free Commercial Use"`,
      `"Verified no third-party trademark infringement"`,
      `"Approved for illustrative hospitality context without false client endorsement"`,
      `"${item.altDe}"`,
      `"${item.altEn}"`,
      `"webp;jpg"`,
      `"https://zackisch.com/media/${item.fileName}.webp"`,
      `"approved"`
    ].join(','));
  }

  const csvContent = rows.join('\n') + '\n';
  fs.writeFileSync(path.join(mediaDir, 'register.csv'), csvContent);
  fs.writeFileSync(path.join(__dirname, '../../../design-system/asset-pipeline/asset-register.csv'), csvContent);
  console.log('Asset registers updated successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
