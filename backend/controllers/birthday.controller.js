const User = require("../models/members.model");

const getTodaysBirthdays = async () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;

  const users = await User.find();

  return users.filter((user) => {
    const dob = new Date(user.dob);
    return dob.getDate() === day && dob.getMonth() + 1 === month;
  });
};

const TodayBirthday = async (req, res) => {
  const birthdays = await getTodaysBirthdays();
  res.json(birthdays);
};

module.exports = { TodayBirthday};
