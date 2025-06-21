import React, { useState, useEffect } from "react";
import { Edit3, Check, X, AlertCircle } from "lucide-react";

export default function AdminSlotCard({ slot, onPriceUpdate }) {
  const [price, setPrice] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrice, setTempPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slot && typeof slot.pricePerDay === "number") {
      setPrice(slot.pricePerDay);
      setTempPrice(slot.pricePerDay);
    }
  }, [slot]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempPrice(price);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempPrice(price);
    setError("");
  };

  const handleUpdate = async () => {
    if (!tempPrice || tempPrice < 1) {
      setError("Price must be greater than ₹0");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onPriceUpdate(slot.side, tempPrice);
      setPrice(tempPrice);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating price:", err);
      setError("Failed to update price. Please try again.");
    }

    setLoading(false);
  };

  if (!slot || !slot.side) {
    return (
      <div className="p-6 border-2 border-red-200 rounded-xl bg-red-100">
        <div className="flex items-center space-x-2 text-red-700">
          <AlertCircle size={20} />
          <span className="font-medium">Invalid slot data</span>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden bg-white border border-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="bg-blue-100 p-4 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <h2 className="text-md font-bold text-blue-900 tracking-wide">
            {slot.side.toUpperCase()} SLOT
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!isEditing ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-500 uppercase font-medium mb-1">Current Price</p>
            <div className="text-3xl font-bold text-gray-800 mb-1">₹{price || 0}</div>
            <p className="text-sm text-gray-500">per day</p>

            <button
              onClick={handleEdit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2"
            >
              <Edit3 size={18} />
              <span>Edit Price</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Price (₹ per day)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  value={tempPrice}
                  onChange={(e) => {
                    setTempPrice(Number(e.target.value));
                    setError("");
                  }}
                  className="w-full pl-8 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 font-semibold"
                  placeholder="0"
                  min="1"
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-xl transition duration-200 flex items-center justify-center space-x-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <Check size={18} />
                <span>{loading ? "Updating..." : "Save"}</span>
              </button>

              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-gray-700 font-medium">Updating price...</span>
          </div>
        </div>
      )}
    </div>
  );
}
