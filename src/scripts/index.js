const { Admin } = require('../models');
const bcrypt = require('bcrypt');

async function scripts() {
  await createFirstAdmin();
}

module.exports = scripts;

async function createFirstAdmin() {
  const result = await Admin.findOne();
  if (result) return;
  const salt = await bcrypt.genSalt(10);
  // console.log('salt is here', salt)
  const hashedPassword = await bcrypt.hash('1212', 10);

  const admin = new Admin({
    phone: '9876543210',
    email: 'admin@gmail.com',
    name: 'Admin',
    password: hashedPassword,
  });
  await admin.save();
  console.log('New admin is created');
}
