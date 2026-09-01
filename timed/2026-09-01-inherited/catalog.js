// catalog.js - THIS is the file you fix. It was written by someone else and it
// mostly works. Four checks are red. Do not rewrite it from scratch.

const PRODUCTS = [
  { id: 1, name: "Laptop Pro",   price: 1800, rating: 4.6, inStock: true  },
  { id: 2, name: "laptop Air",   price: 1100, rating: 4.8, inStock: true  },
  { id: 3, name: "Mouse",        price: 25,   rating: 4.1, inStock: false },
  { id: 4, name: "Keyboard",     price: 90,   rating: 4.8, inStock: true  },
  { id: 5, name: "Monitor 27",   price: 500,  rating: 4.3, inStock: true  },
  { id: 6, name: "USB Hub",      price: 50,   rating: 3.9, inStock: false },
  { id: 7, name: "Desk Lamp",    price: 100,  rating: 4.2, inStock: true  },
  { id: 8, name: "Cable",        price: 15,   rating: 4.0, inStock: true  },
];

function findByName(list, query) {
  return list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).map((p) => p.id);
}

function topRated(list, n) {
  return [...list]
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
    .slice(0, n)
    .map((p) => ({ name: p.name, rating: p.rating }));
}

function priceBands(list) {
  const bands = { cheap: [], mid: [], pricey: [] };
  for (const p of list) {
    if (p.price < 50) bands.cheap.push(p.id);
    else if (p.price <= 500) bands.mid.push(p.id);
    else bands.pricey.push(p.id);
  }
  return bands;
}

function stockSummary(list) {
  const activeProducts = list.filter(item => item.inStock);
  const total = activeProducts.reduce((sum, p) => sum + p.price, 0);

  return { count: activeProducts.length, averagePrice: parseFloat((total / activeProducts.length).toFixed(2)) };
}

module.exports = { PRODUCTS, findByName, topRated, priceBands, stockSummary };
