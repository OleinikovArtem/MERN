const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()


//   /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Incorrect pasword, min 6 ').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect registration data'
        })
      }

      const { email, password } = req.body

      const condidate = await User.findOne({ email })
      if (condidate) {
        return res.status(400).json({ message: 'Such user already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })

      await user.save()
      
      res.status(201).json({ message: 'User created' })

    } catch (error) {
      res.status(500).json({ message: 'something is wrong, try again' })
    }
  })

router.post(
  '/login',
  [
    check('email', 'Enter the correct Email').normalizeEmail().isEmail(),
    check('password', 'Enter the password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect login data'
        })
      }

      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'User not founded' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorect password, try again' })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )

      res.json({ token, userId: user.id })

    } catch (error) {
      res.status(500).json({ message: 'something is wrong, try again' })
    }
  })


module.exports = router