import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const Cartify = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cartify</h1>
            <p className="text-sm text-gray-500">Your favorite online store</p>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Products</h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500">No products available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                  <span className="text-2xl font-bold text-indigo-600">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Cartify;
