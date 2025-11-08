import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

const Cartify = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: ''
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);

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

  const updateQuantity = async (cartItemId, change) => {
    console.log("cartItemId", cartItemId, change);
    const item = cart.find((i) => i._id === cartItemId);
    if (!item) {
      alert("error ocuured here");
      return;
    }

    const newQty = item.quantity + change;
    if (newQty < 1) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      await fetchCart();
    } catch (err) {
      setError("Failed to update quantity");
      console.error(err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove item");

      await fetchCart();
    } catch (err) {
      setError("Failed to remove item");
      console.error(err);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!checkoutForm.name || !checkoutForm.email) {
      setError("Please fill in all fields");
      return;
    }

    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cart,
          customerInfo: checkoutForm,
        }),
      });

      if (!response.ok) throw new Error("Checkout failed");

      const data = await response.json();
      setReceipt(data);
      setShowCheckout(false);
      setShowCart(false);
      setShowReceipt(true);
      setCart([]);
      setCartTotal(0);
      setCheckoutForm({ name: "", email: "" });
      setError("");
    } catch (err) {
      setError("Checkout failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-300">
      <header className="bg-red-500 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between space-x-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Cartify</h1>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="relative px-4 py-8 text-white bg-gray-500 rounded-lg hover:bg-white hover:text-black transition-colors"
          >
            <p>Cart</p>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-800 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-20 py-20 flex items-center justify-between gap-10">
        <div className="text-black flex-1 text-4xl">
          <h1 className="mb-10">Cartify</h1>
          <p className="text-xl text-gray-700">
            Shop and get your favourite items.
          </p>
        </div>

        <div className="flex-1">
          <img
            className="w-full h-auto object-cover"
            src="/main_bg.png"
            alt="bg"
          />
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8 bg-red-500">
        <h2 className="text-3xl font-bold text-white mb-6">
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
                  <h3 className="font-semibold text-gray-900 mb-1 text-2xl">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-black">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 flex items-center space-x-2"
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

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-neutral-900/70 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Go back
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-black font-semibold">
                          ${item.product.price.toFixed(2)}
                        </p>

                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-8 h-8 bg-white text-black border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-black font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-8 h-8 bg-white text-black border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <span className="font-bold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-4">
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-black">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-neutral-900/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Go Back
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={checkoutForm.name}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  required
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Order Summary
                </h3>
                <div className="space-y-1 text-sm text-black">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span>
                        {item.product.name} x{item.quantity}
                      </span>
                      <span>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-300 text-black mt-2 pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-black">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3 bg-yellow-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{loading ? "Processing..." : "Complete Purchase"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showReceipt && receipt && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
              <p className="text-gray-600">Thank you for your purchase</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono font-semibold text-black">{receipt.orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold text-black">{new Date(receipt.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Customer:</span>
                <span className="font-semibold text-black">{receipt.customerInfo.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-black">{receipt.customerInfo.email}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Items Purchased:</h3>
              <div className="space-y-2">
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-black">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 text-black mt-3 pt-3 flex justify-between font-bold text-lg">
                <span>Total Paid:</span>
                <span className="text-green-600">${receipt.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceipt(false)}
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cartify;
