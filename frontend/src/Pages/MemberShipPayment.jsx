import React, { useContext, useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle, IndianRupee, Clock, Shield, Award } from 'lucide-react';
import { UserDataContext } from '../Context/userContext';
import { toast } from "react-hot-toast";

const MembershipPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { LoggedInUser,setLoggedInUser } = useContext(UserDataContext);
  const token = localStorage.getItem("token");

  const membershipFee = 5000;
  const getUserData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/get-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const {
          password,
          __v,
          createdAt,
          updatedAt,
          ...safeUser
        } = data.user;

        setLoggedInUser(safeUser);
      } else {
        toast.error(data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error("Error while fetching user data " + error);
    }

  }
  const addToDatabase = async (amount, transactionId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/members/${LoggedInUser._id}/membership-fees`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPaid: true,
          amount,
          transactionId
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Payment Successful");
        setPaymentSuccess(true);
        getUserData();
      }
      else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err);
    }

  }
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const amount = 5000
      // Step 1: Create Razorpay Order
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();
      const { id: order_id, currency, amount: orderAmount } = data.order;

      const options = {
        key: "rzp_test_hf54kCj6NjigUj",
        amount: orderAmount,
        currency,
        order_id,
        name: "Vaishnav Vanik Aamaaj",
        description: "",
        handler: async (response) => {
          const verifyRes = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: LoggedInUser.email,
              mailPurpose: "Membership Payment Success",
              amount,
              name: LoggedInUser.firstName + " " + LoggedInUser.lastName
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            addToDatabase(amount, response.razorpay_payment_id);
          } else {
            toast.error("Payment Failed");
          }
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your membership has been activated successfully. Welcome to our community!
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Amount Paid:</span>
              <span className="text-green-800 font-bold text-lg">
                {formatCurrency(membershipFee)}
              </span>
            </div>
          </div>
          <button
            onClick={() => setPaymentSuccess(false)}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* Left - Header and Benefits */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-10 flex flex-col justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Membership Required</h1>
          <p className="text-blue-100 mb-6">Join our exclusive community today</p>

          <h3 className="text-lg font-semibold mb-4">Membership Benefits</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
              Access to all events and activities
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
              Exclusive member discounts
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
              Priority booking for events
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
              Community networking opportunities
            </li>
          </ul>
        </div>

        {/* Right - Payment Form */}
        <div className="p-10">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-amber-800 font-medium mb-1">
                  Payment Required
                </h3>
                <p className="text-amber-700 text-sm">
                  Please complete your membership payment to access all features and services.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Membership Fee:</span>
              <span className="text-2xl font-bold text-gray-900 flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {membershipFee.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Valid for:</span>
              <span className="text-gray-700 font-medium">1 Year</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="h-5 w-5 mr-3" />
                Pay {formatCurrency(membershipFee)}
              </div>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <Shield className="h-4 w-4 mr-2" />
            <span>Secure payment powered by trusted payment gateway</span>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 inline" />
            Membership activates immediately after payment
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPayment;
