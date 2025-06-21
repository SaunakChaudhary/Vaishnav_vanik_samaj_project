const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date },
  academicBackground: { type: String },
  achivements: { type: String },
  profession: { type: String },
  photo: { type: String, default: "default.jpg" },
  relation: { type: String, required: true },
  phone: { type: String },
  bloodGroup: { type: String },
  email: { type: String }
});

const memberSchema = new mongoose.Schema({
  memberId: { type: Number, unique: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String },
  wp_number: { type: String },
  password: { type: String, required: true },
  city: { type: String, default: "Anand" }, 
  state: { type: String, default: "Gujarat" },
  country: { type: String, default: "India" },
  pincode: { type: String },
  address: { type: String},
  dob: { type: Date},
  academicBackground: { type: String },
  photo: { type: String, default: "default.jpg" },
  profession: { type: String },
  bloodGroup: { type: String },
  achivements: { type: String },
  education: { type: String },
  professionAddress: { type: String },
  caste: { type: String, required: true },
  role: {
    type: String,
    enum: ["president", "vice president", "secretary", "board member", "member"],
    default: "member",
  },
  familyMembers: [familyMemberSchema],
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "accepted", 
  },
  membershipFees: {
    isPaid: { type: Boolean, default: true },
    amount: { type: Number, default: 5000 },
    transactionId: { type: String },
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model("Member", memberSchema);