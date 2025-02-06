const fs = require('fs');
const casual = require('casual');

const productTypes = ['TVs', 'Appliances', 'Phones', 'Video Games'];

const categoryImages = {
  TVs: '/assets/images/tv.webp',
  Appliances: '/assets/images/appliances.webp',
  Phones: '/assets/images/phones.webp',
  'Video Games': '/assets/images/video-games.webp'
};

const generateProduct = (id) => {
  const type = casual.random_element(productTypes);
  return {
    id,
    name: casual.title,
    type,
    price: casual.integer(100, 2000),
    rating: casual.double(1, 5).toFixed(1),
    description: casual.sentences(3),
    image: categoryImages[type],
    reviews: Array.from({ length: casual.integer(1, 5) }, () => casual.sentence),
  };
};

const products = Array.from({ length: 250}, (_, i) => generateProduct(i + 1));

fs.writeFileSync('db.json', JSON.stringify({ products }, null, 2));

console.log('Mock data generated successfully!');
