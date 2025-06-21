const Contact = require("../models/contact.model");
const sendMail = require("../helper/sendMail");

const contactusForm = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Thank you for contacting us!</h2>
        <p style="color: #666;">Dear ${fullName},</p>
        <p style="color: #666;">We have received your message regarding "${subject}". Our team will get back to you as soon as possible.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #888;">Your message:</p>
            <p style="color: #444;">${message}</p>
        </div>
        <p style="color: #666;">Best regards,<br>Vaishnav Vanik Samaaj</p>
    </div>
    `;

    const mailSent = await sendMail(
      email,
      "Thank you for contacting us!",
      "",
      html
    );
    const contact = await Contact.create({
      fullName,
      email,
      subject,
      message,
    });

    if (mailSent && contact) {
      return res.status(200).json({
        message: "Thank you for contacting us! We will get back to you soon.",
      });
    }

    return res.status(400).json({
      message: "Failed to send message. Please try again.",
    });
  } catch (err) {
    console.error("Authentication Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const displayInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find({}).sort({ createdAt: -1 });
    return res.status(200).json(inquiries);
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const replyToInquiry = async (req, res) => {
  try {
    const { inquiryId, replyMessage } = req.body;

    const inquiry = await Contact.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Response to your inquiry</h2>
        <p style="color: #666;">Dear ${inquiry.fullName},</p>
        <p style="color: #666;">Regarding your message about "${inquiry.subject}":</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #444;">${replyMessage}</p>
        </div>
        <p style="color: #666;">Best regards,<br>Vaishnav Vanik Samaaj</p>
    </div>
    `;

    const mailSent = await sendMail(
      inquiry.email,
      `Re: ${inquiry.subject}`,
      "",
      html
    );

    const updatedInquiry = await Contact.findByIdAndUpdate(
      inquiryId,
      { status: 'replied' },
      { new: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({ message: "Failed to update inquiry status" });
    }

    if (mailSent) {
      return res.status(200).json({ message: "Reply sent successfully" });
    }
    return res.status(400).json({ message: "Failed to send reply" });
  } catch (err) {
    console.error("Reply Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { contactusForm, displayInquiries, replyToInquiry };
