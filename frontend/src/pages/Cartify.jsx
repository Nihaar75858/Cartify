import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

const Cartify = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCart, setShowCart] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      }
    };

    fetchProducts();
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`);
      const data = await response.json();
      setCart(data.items || []);
      setCartTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const addToCart = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");

      await fetchCart();
      setError("");
    } catch (err) {
      setError("Failed to add item to cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cartify</h1>
            <p className="text-sm text-gray-500">Your favorite online store</p>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="relative px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Featured Products
        </h2>

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
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      <span>Add</span>
                    </button>
                  </div>
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
