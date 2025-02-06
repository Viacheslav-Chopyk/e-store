const fs = require('fs');
const casual = require('casual');

const productTypes = ['TVs', 'Appliances', 'Phones', 'Video Games'];

const generateProduct = (id) => ({
  id,
  name: casual.title,
  type: casual.random_element(productTypes),
  price: casual.integer(100, 2000),
  rating: casual.double(1, 5).toFixed(1),
  description: casual.sentences(3),
  image: `https://via.placeholder.com/150?text=Product+${id}`,
  reviews: Array.from({ length: casual.integer(1, 5) }, () => casual.sentence),
});

const products = Array.from({ length: 50 }, (_, i) => generateProduct(i + 1));

fs.writeFileSync('mock-data/db.json', JSON.stringify({ products }, null, 2));

console.log('Mock data generated successfully!');
