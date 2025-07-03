import React, { useEffect, useState } from 'react';
import instance from '../api';


interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

interface Props {
  goBack: () => void;
}

const Products: React.FC<Props> = ({ goBack }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    instance.get('http://localhost:5000/product/list')
      .then(res => setProducts(res.data.products))
      .catch(err => console.error(err));
  }, []);

  return (
    <div><center>
      <h2>Product Preview</h2>
      {products.map(p => (
        <div id='border' key={p._id} style={{ marginBottom: '1rem' }}>
          {p.image && <img src={`http://localhost:5000/uploads/${p.image}`} width={220} height={210} alt="product" />}
          <p><strong>{p.name}</strong></p>
          <p>{p.description}</p>
          <p style={{backgroundColor:'green', width:'80px'}}>₹{parseFloat(p.price).toLocaleString()}</p>      
          </div>
      ))}</center>
      <button onClick={goBack}>Back</button>
    </div>
  );
};

export default Products;


