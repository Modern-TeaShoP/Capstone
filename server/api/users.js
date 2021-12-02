const router = require('express').Router();
const {
  models: { User },
} = require('../db');
module.exports = router;

router.get('/email/:email', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.params.email },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/id/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});
