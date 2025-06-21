import { useContext, useState } from 'react';
import { toast } from "react-hot-toast";
import { UserDataContext } from '../Context/userContext';

export default function SamajDonationPage() {
    const { LoggedInUser } = useContext(UserDataContext); // Using mock data

    const [formData, setFormData] = useState({
        fullName: '',
        email: LoggedInUser.email,
        phone: '',
        amount: '',
        message: ''
    });

    const [selectedAmount, setSelectedAmount] = useState('');

    const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
        setFormData(prev => ({
            ...prev,
            amount: amount.toString()
        }));
    };

    const handleCustomAmount = (e) => {
        const value = e.target.value;
        setSelectedAmount('');
        setFormData(prev => ({
            ...prev,
            amount: value
        }));
    };

    const addToDatabase = async (transactionId) => {
        const response = await fetch("http://localhost:5000/api/donation/donate-amount", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                transactionId
            })
        });
        const data = await response.json();
        if (response.ok) {
        } else {
            toast.error(data.message);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.amount) {
                toast.error("Please enter donation amount");
                return;
            }
            const amount = parseInt(formData.amount);

            if (isNaN(amount) || amount <= 0) {
                toast.error("Please enter a valid donation amount");
                return;
            }

            // Step 1: Create Razorpay Order
            const response = await fetch('http://localhost:5000/api/payment/create-order', {
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
                name: "Vaishnav Vanik Samaaj",
                description: "Thank you for your generous donation to support our community initiatives. Your contribution helps us serve and strengthen our Samaj.",
                handler: async (response) => {
                    const verifyRes = await fetch('http://localhost:5000/api/payment/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            email: formData.email,
                            mailPurpose: "Donation",
                            amount,
                            name: formData.fullName
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        toast.success("Payment Successful");
                        addToDatabase(response.razorpay_payment_id);
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
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Donation Form */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
                        Make a Donation
                    </h2>

                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={LoggedInUser.email}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {/* Donation Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Donation Amount (₹) *
                            </label>

                            {/* Preset Amount Buttons */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {presetAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => handleAmountSelect(amount)}
                                        className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${selectedAmount === amount
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                                            }`}
                                    >
                                        ₹{amount.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Amount Input */}
                            <div>
                                <label htmlFor="customAmount" className="block text-sm font-medium text-gray-600 mb-2">
                                    Or enter custom amount
                                </label>
                                <input
                                    type="number"
                                    id="customAmount"
                                    name="amount"
                                    min="1"
                                    required
                                    value={formData.amount}
                                    onChange={handleCustomAmount}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter amount in ₹"
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Message (Optional)
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="4"
                                value={formData.message}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                placeholder="Share why you're supporting Samaj or leave a message..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all transform hover:scale-105 cursor-pointer text-center"
                        >
                            Donate Now
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 text-center">
                            🔒 Your donation is secure and encrypted. We respect your privacy and will never share your information.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500">
                    <p>Thank you for supporting Vaishnav Vanik Samaj's mission to build stronger communities.</p>
                </div>
            </div>
        </div>
    );
}