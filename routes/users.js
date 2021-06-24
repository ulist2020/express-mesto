const router = require('express').Router();

const {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:_id', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
