const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user');

const User = require('../model/User');
const advancedResult = require('../middleware/advancedResult');
const { protect, authorize } = require('../middleware/auth');

router.use(protect)
router.use(authorize('admin'))

router.route('/')
  .get(advancedResult(User), getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

module.exports = router;