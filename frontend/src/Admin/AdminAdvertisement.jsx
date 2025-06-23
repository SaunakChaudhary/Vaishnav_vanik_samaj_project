import React, { useEffect, useState } from "react";
import AdminSlotCard from "../Components/AdminSlotCard";
import Slidebar from "../Components/Slidebar";
import { toast } from "react-hot-toast";
import { Riple } from "react-loading-indicators";

export default function AdminPanel() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [slots, setSlots] = useState([]);
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/advertisement/admin/ad-price`);
      const data = await res.json();
      if (data.success) {
        setSlots(data.slots);
      } else {
        toast.error(data.message || "Failed to fetch slots");
      }
    } catch (err) {
      toast.error("Failed to fetch slots");
      console.error("Failed to fetch slots:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/advertisement/admin/get-ad-fees`);
      const data = await res.json();
      if (data.success) {
        setFees(data.fees);
      } else {
        toast.error(data.message || "Failed to fetch advertisement fees");
      }
    } catch (err) {
      toast.error("Failed to fetch advertisement fees");
      console.error("Failed to fetch advertisement fees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrice = async (side, newPrice) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/advertisement/admin/set-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ side, pricePerDay: newPrice }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Price updated successfully!");
        fetchSlots(); // Refresh
      } else {
        toast.error(data.message || "Failed to update price");
      }
    } catch (err) {
      toast.error("Failed to update price");
      console.error("Update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchFees();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex justify-center items-center">
          <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
        </div>
      )}
      
      <Slidebar highlight="advertise" />
      
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 ml-0 md:ml-64 mt-16 lg:mt-0">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Advertisement Management</h1>
          <p className="text-gray-600 mt-1">Manage advertisement pricing and slots for different website positions</p>
        </div>

        {/* Slot Packages Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Advertisement Slot Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {slots.map((slot, index) => (
              <AdminSlotCard key={index} slot={slot} onPriceUpdate={updatePrice} />
            ))}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Advertisement Fee Transactions</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-medium text-gray-700">
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 hidden md:table-cell">Status</th>
                  <th className="px-4 py-3">Slot</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Duration</th>
                  <th className="px-4 py-3 hidden xl:table-cell">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No fee records found
                    </td>
                  </tr>
                ) : (
                  fees.map((fee) => {
                    const fullName = `${fee.user.firstName} ${fee.user.middleName} ${fee.user.lastName}`;
                    return (
                      <tr key={fee._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium">{fullName}</div>
                          <div className="text-sm text-gray-500 sm:hidden">{fee.user.email}</div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div className="text-sm text-gray-600">{fee.user.email}</div>
                        </td>
                        <td className="px-4 py-3 font-medium">₹{fee.price}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            fee.user.membershipFees?.isPaid 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {fee.user.membershipFees?.isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">{fee.advetiseLocation} of the website</div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="text-sm">{fee.duration} days</div>
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <div className="text-sm font-mono text-gray-500 truncate max-w-[150px]">
                            {fee.transactionId}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}