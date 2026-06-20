export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5&fields=product_name,image_front_url,code`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SmartShopper-Botswana/1.0 (contact@smartshopper.co.bw)',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Open Food Facts request failed' });
    }

    const data = await response.json();

    const products = (data.products || [])
      .filter(p => p.image_front_url)
      .map(p => ({
        name: p.product_name,
        image: p.image_front_url,
        code: p.code,
      }));

    return res.status(200).json({ products });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
