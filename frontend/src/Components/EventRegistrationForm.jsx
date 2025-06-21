import React, { useState, useEffect, useContext } from 'react';
import { X } from 'lucide-react';
import { UserDataContext } from '../Context/userContext';
import { toast } from "react-hot-toast";

const EventRegistrationForm = ({ setEventsDetails, eventDetails, onRegistrationSuccess }) => {
    const { LoggedInUser } = useContext(UserDataContext);
    const [formData, setFormData] = useState({
        firstName: LoggedInUser.firstName,
        middleName: LoggedInUser.middleName,
        lastName: LoggedInUser.lastName,
        email: LoggedInUser.email,
        phone: LoggedInUser.phone_number,
        city: LoggedInUser.city,
        state: LoggedInUser.state,
        pincode: LoggedInUser.pincode,
        country: LoggedInUser.country,
        familyCount: LoggedInUser.familyMembers.length + 1,
        extraCount: 0,
    });

    const [hasExtra, setHasExtra] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    const basePrice = eventDetails.feesPerPerson;
    const extraPrice = eventDetails.feesForExtraGuest;

    useEffect(() => {
        const family = parseInt(formData.familyCount) || 0;
        const extra = hasExtra ? parseInt(formData.extraCount) || 0 : 0;
        setTotalPrice((family + extra) * basePrice + extra * (extraPrice - basePrice));
    }, [formData.familyCount, formData.extraCount, hasExtra]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addToDatabase = async (amount, transactionId) => {
        const event = eventDetails._id;
        const member = LoggedInUser._id;
        const totalPersons = parseInt(formData.familyCount) + parseInt(formData.extraCount);

        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        try {
            const response = await fetch('http://localhost:5000/api/events/event-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    memberId: member,
                    eventId: event,
                    totalPersons: totalPersons,
                    amount: amount,
                    status: 'completed',
                    transactionId: transactionId,
                    paymentDate: date
                })
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setEventsDetails(null);
                onRegistrationSuccess();
            } else {
                toast.error(data.message);
            }
        }
        catch (err) {
            console.error(err);
            toast.error("Registration Failed");
        }
    }

    const handlePay = async (e, amount) => {
        e.preventDefault();
        try {
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
                name: "Vaishnav Vanik Aamaaj",
                description: "",
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
                            mailPurpose: "Event Registration",
                            amount,
                            name: formData.firstName + " " + formData.lastName
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        toast.success("Payment Successful");
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
    };

    return (
        <div className='bg-black/50 w-full fixed z-50 top-0 left-0 h-screen pt-10'>
            <div className='fixed right-5 top-5 text-white cursor-pointer' onClick={() => setEventsDetails(null)}>
                <X />
            </div>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
                <h2 className="text-2xl font-bold mb-4">
                    Event Registration <span className='text-xl items-center'>(Last Date of Registration : {new Date(eventDetails.lastRegistrationDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })})</span></h2>
                <form className="space-y-4">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['firstName', 'middleName', 'lastName'].map((field) => (
                            <input
                                key={field}
                                name={field}
                                placeholder={field.replace(/([A-Z])/g, ' $1')}
                                value={formData[field]}
                                onChange={handleChange}
                                className="p-2 border rounded"
                                required={field !== 'middleName'}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border rounded" required />
                        <input name="phone" type="tel" placeholder="Phone" value={formData.phone} onChange={handleChange} className="p-2 border rounded" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="p-2 border rounded" required />
                        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="p-2 border rounded" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="p-2 border rounded" required />
                        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="p-2 border rounded" required />
                    </div>

                    {/* Family Members */}
                    <div>
                        <label className="block font-medium mb-1">Family Members Attending (including you):</label>
                        <input
                            name="familyCount"
                            type="number"
                            min="1"
                            value={formData.familyCount}
                            onChange={handleChange}
                            className="p-2 border rounded w-full"
                            required
                            readOnly
                        />
                    </div>

                    {/* Extra Member Toggle */}
                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            checked={hasExtra}
                            onChange={() => setHasExtra(!hasExtra)}
                            className="w-4 h-4"
                        />
                        <label className="text-sm">Add Extra Members?</label>
                    </div>

                    {hasExtra && (
                        <div>
                            <label className="block font-medium mb-1">Number of Extra Members:</label>
                            <input
                                name="extraCount"
                                type="number"
                                min="0"
                                value={formData.extraCount}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                                required
                            />
                        </div>
                    )}

                    {/* Total Price */}
                    <div className="mt-4 p-3 bg-blue-100 text-blue-800 font-semibold rounded">
                        Total Price: ₹{totalPrice.toFixed(2)}
                    </div>

                    <button onClick={(e) => handlePay(e, totalPrice.toFixed(2),)} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4">
                        Pay Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EventRegistrationForm;
