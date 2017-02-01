const userService = require('../service/user.service');

const createUser = userService.create({
  email: 'mateus.oli.car@gmail.com',
  name:  'admin',
  password: 'admin'
}).then((user) => console.log(`User ${user.name} inserted`));

Promise.all([
  createUser,
]).then(() => process.exit(0))
  .catch((err) => process.exit(err));
