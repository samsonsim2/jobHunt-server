import { StatusCodes } from 'http-status-codes/build/cjs/status-codes.js'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import UnAuthenticatedError from '../errors/unauthenticated.js'
import User from '../models/User.js'

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values')
  }

  const userAlreadyExist = await User.findOne({ email })

  if (userAlreadyExist) {
    throw new BadRequestError('Email already exists')
  }

  //create user
  const user = await User.create({ name, email, password })
  //create jwt
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  })
}

//LOGIN FUNCTIONALITY
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide all values')
  }

  const user = await User.findOne({ email }).select('+password')
  // if user doesnt exist throw unauthenticated error
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials no such user')
  }
  // if user exists, check password

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials Wrong password')
  }

  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user, token, location: user.location })

  res.send('login user')
}

const updateUser = async (req, res) => {
  console.log(req.user)
  const { email, name, lastName, location } = req.body

  if (!email || !name || !location || !lastName) {
    throw new BadRequestError('Please provide all values')
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name, lastName, location },
    {
      new: true,
    }
  )

  const token = user.createJWT()

  res.status(StatusCodes.OK).json({ user, token, location: user.location })
}

export { register, login, updateUser }
