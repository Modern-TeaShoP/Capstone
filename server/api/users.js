const router = require('express').Router();
const {
  models: { User },
} = require('../db');
module.exports = router;

router.get('/:email', async (req, res, next) => {
  try {
    const users = await User.findOne({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      where: { email: req.params.email },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});
