const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const User = require("../models/members.model"); // update with your user model path
const XLSX = require("xlsx");
const sendMail = require("../helper/sendMail");
const bcrypt = require("bcryptjs");
const Member = require("../models/members.model");

const downloadExcel = async (req, res) => {
  try {
    const users = await User.find();

    // Prepare data
    const data = users.map((user, index) => ({
      SNo: index + 1,
      Name: user.firstName + " " + user.lastName,
      Email: user.email,
      Address: user.address,
      Caste: user.caste,
      Fees: user.membershipFees.isPaid ? "Paid" : "Pending",
      Role: user.role,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // File path
    const filePath = path.join(__dirname, "../exports/users.xlsx");

    // Write Excel file
    XLSX.writeFile(workbook, filePath);

    // Send to browser
    res.download(filePath, "users-report.xlsx", () => {
      fs.unlinkSync(filePath); // delete after download
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate Excel file" });
  }
};

const downloadPDF = async (req, res) => {
  try {
    const users = await User.find();

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      layout: "portrait",
      info: {
        Title: "User Report",
        Author: "Your Application Name",
        Subject: "Registered Users",
      },
    });

    const filePath = path.join(__dirname, "../exports/users.pdf");
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Header
    doc
      .fillColor("#2c3e50")
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("USER REPORT", { align: "center" });

    doc.moveDown(0.5);

    // Subtitle
    doc
      .fillColor("#666666")
      .font("Helvetica")
      .fontSize(12)
      .text(`Generated on ${new Date().toLocaleDateString()}`, {
        align: "center",
      });

    doc.moveDown(1.5);

    // Summary box
    const summaryY = doc.y;
    doc.rect(40, summaryY, 515, 30).fill("#f2f2f2");

    doc
      .fillColor("#333333")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Total Users:", 50, summaryY + 8)
      .font("Helvetica")
      .text(users.length.toString(), 130, summaryY + 8);

    doc.moveDown(3);

    // Table header
    const colTitles = ["No.", "Name", "Email", "Role"];
    const colWidths = [40, 160, 200, 100];
    const colPositions = [50, 100, 270, 480];
    const tableTop = doc.y;

    doc.fillColor("#2c3e50").rect(40, tableTop, 515, 25).fill();

    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(11);

    colTitles.forEach((title, i) => {
      doc.text(title, colPositions[i], tableTop + 8, {
        width: colWidths[i],
        align: "left",
      });
    });

    // Table rows
    doc.font("Helvetica").fontSize(10);
    let y = tableTop + 25;

    users.forEach((user, index) => {
      if (y + 30 > doc.page.height - 50) {
        // Add page break and repeat table header
        doc.addPage();
        y = 50;

        // Header row again
        doc.fillColor("#2c3e50").rect(40, y, 515, 25).fill();

        doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(11);

        colTitles.forEach((title, i) => {
          doc.text(title, colPositions[i], y + 8, {
            width: colWidths[i],
            align: "left",
          });
        });

        y += 25;
        doc.font("Helvetica").fontSize(10);
      }

      // Alternate row color
      if (index % 2 === 0) {
        doc.fillColor("#f9f9f9").rect(40, y, 515, 25).fill();
      }

      doc.fillColor("#333333");

      doc.text(index + 1, colPositions[0], y + 8);
      doc.text(`${user.firstName} ${user.lastName}`, colPositions[1], y + 8);
      doc.text(user.email, colPositions[2], y + 8);
      doc.text(user.role, colPositions[3], y + 8);

      y += 25;
    });

    // Footer
    const addFooter = () => {
      const footerY = doc.page.height - 40;
      doc
        .fillColor("#888888")
        .fontSize(10)
        .text("Confidential - For internal use only", 50, footerY, {
          align: "left",
        })
        .text(`Page ${doc.page.number}`, 0, footerY, { align: "right" });
    };

    addFooter();

    doc.on("pageAdded", addFooter); // Apply footer on every new page

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, "users-report.pdf", () => {
        fs.unlinkSync(filePath); // Delete after download
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

const uploadExcel = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    let savedMembers = [];

    const membersMap = new Map();

    data.forEach((row) => {
      if (row["Member No"]) {
        membersMap.set(row["Member No"], {
          primary: row,
          family: [],
        });
      } else if (row.Relation && membersMap.size > 0) {
        const lastKey = [...membersMap.keys()][membersMap.size - 1];
        membersMap.get(lastKey).family.push(row);
      }
    });

    for (const [memberNo, memberData] of membersMap) {
      const primary = memberData.primary;
      const familyMembers = memberData.family;

      const generatedPassword = `${memberNo}@123`;
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const address =
        primary.Address && primary.Address !== "-" ? primary.Address : "";
      const pincodeMatch = address.match(/- (\d{6})$/);
      const pincode = pincodeMatch ? pincodeMatch[1] : "";

      const newMember = new Member({
        memberId: memberNo,
        photo:
          "/uploads/Default/User.png",
        firstName: primary.firstName || "",
        middleName: primary.middleName || "",
        lastName: primary.lastName || "",
        email: primary.Email || "",
        phone_number:
          primary["Mobile Number(s)"] && primary["Mobile Number(s)"] !== "-"
            ? primary["Mobile Number(s)"]
            : "",
        password: hashedPassword,
        city: address.includes("Anand") ? "Anand" : "Vallabh Vidyanagar",
        state: "Gujarat",
        country: "India",
        pincode: pincode,
        address: address,
        dob:
          primary.dob && primary.dob !== "-"
            ? convertExcelDate(primary.dob)
            : undefined,
        academicBackground:
          primary.Education && primary.Education !== "-"
            ? primary.Education
            : "",
        profession:
          primary.Profession && primary.Profession !== "-"
            ? primary.Profession
            : "",
        bloodGroup:
          primary["Blood Group"] && primary["Blood Group"] !== "-"
            ? primary["Blood Group"]
            : "",
        caste: primary.Caste && primary.Caste !== "-" ? primary.Caste : "",
        familyMembers: familyMembers.map((fm) => ({
          fullName: fm.firstName + " " + fm.middleName + " " + fm.lastName || "",
          dob: fm.dob && fm.dob !== "-" ? convertExcelDate(fm.dob) : undefined,
          academicBackground:
            fm.Education && fm.Education !== "-" ? fm.Education : "",
          profession:
            fm.Profession && fm.Profession !== "-" ? fm.Profession : "",
          relation: fm.Relation || "",
          phone:
            fm["Mobile Number(s)"] && fm["Mobile Number(s)"] !== "-"
              ? fm["Mobile Number(s)"]
              : "",
          bloodGroup:
            fm["Blood Group"] && fm["Blood Group"] !== "-"
              ? fm["Blood Group"]
              : "",
          photo:
          "/uploads/Default/User.png",
        })),
        status: "accepted",
      });

      await newMember.save();

      const emailHTML = generateWelcomeEmail(
        primary.firstName,
        primary.Email,
        generatedPassword
      );

        
      // await sendMail(primary.Email, "Your Login Credentials", "", emailHTML);

      savedMembers.push({
        memberId: memberNo,
        email: primary.Email,
        name: `${primary.firstName || ""} ${primary.lastName || ""}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${savedMembers.length} members imported successfully`,
      importedMembers: savedMembers,
    });
  } catch (error) {
    console.error("Error importing members:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import members",
      error: error.message,
    });
  }
};

// Helper function to convert Excel date string to Date object
function convertExcelDate(excelDate) {
  if (!excelDate) return null;

  // Handle cases where Excel might have converted to serial number
  if (typeof excelDate === "number") {
    return new Date((excelDate - 25569) * 86400 * 1000);
  }

  // Handle DD-MM-YYYY format
  const parts = excelDate.split("-");
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }

  return new Date(excelDate);
}

// Helper function to generate welcome email HTML
function generateWelcomeEmail(name, email, password) {
  return `
    <table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      <tr>
        <td style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
          <h2>Welcome to Vaishnav Vanik Samaj</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 16px;">Your account has been successfully created.</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p style="margin: 0;"><strong>Login Credentials:</strong></p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <p style="font-size: 15px; color: #555;">Please change your password after first login.</p>
          <p style="margin-top: 30px;">Best regards,<br/>Vaishnav Vanik Samaj Team</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 14px; color: #888;">
          © ${new Date().getFullYear()} Vaishnav Vanik Samaj
        </td>
      </tr>
    </table>
  `;
}

// Password Generator Function
function generateRandomPassword(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

module.exports = { downloadExcel, downloadPDF, uploadExcel };
