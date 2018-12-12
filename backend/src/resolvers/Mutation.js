const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getUserId } = require('../utils')

const Mutation = {
  createItem(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)
    return ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          owner: {
            connect: {
              id: currentUserId,
            },
          },
        },
      },
      info
    )
  },

  async updateItem(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)
    const { id, ...data } = args

    const item = await ctx.db.query.item({ where: { id } }, '{ owner { id } }')

    const ownsItem = item.owner.id === currentUserId
    const hasPermission = true

    if (!ownsItem || !hasPermission) {
      throw new Error("You don't have permissions to do that")
    }

    return ctx.db.mutation.updateItem(
      {
        data,
        where: {
          id,
        },
      },
      info
    )
  },

  async signUp(_, args, ctx, info) {
    const { password, confirmPassword, email, ...user } = args

    if (password !== confirmPassword) {
      throw new Error("The two passwords doesn't match")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const formattedEmail = email.toLowerCase()

    const createdUser = await ctx.db.mutation.createUser(
      {
        data: {
          ...user,
          password: hashedPassword,
          email: formattedEmail,
        },
      },
      info
    )

    return createdUser
  },

  async signIn(_, args, ctx) {
    const { email, password } = args
    const errorMessage = 'Login error'

    const user = await ctx.db.query.user({
      where: { email },
    })

    if (!user) {
      throw new Error(errorMessage)
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      throw new Error(errorMessage)
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // Set the token as a cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })

    return user
  },

  signOut(_, args, ctx) {
    ctx.response.clearCookie('token')
    return { message: 'Goodbye!' }
  },

  async book(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const { itemId, startDate, endDate, ...rent } = args

    // TODO: Validate dates

    const item = await ctx.db.query.item(
      { where: { id: itemId } },
      '{ owner { id }, maxDuration }'
    )

    // Check if user is owner of item
    if (item.owner.id === currentUserId) {
      throw new Error("You can't book your own item, obviously")
    }

    // TODO: Check if rent violates maxDuration

    return ctx.db.mutation.createRent(
      {
        data: {
          ...rent,
          startDate,
          endDate,
          item: {
            connect: {
              id: itemId,
            },
          },
          renter: {
            connect: {
              id: currentUserId,
            },
          },
        },
      },
      info
    )
  },

  async cancel(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const { id } = args

    const rent = await ctx.db.query.rent(
      { where: { id } },
      '{ item { owner { id } }, renter { id } }'
    )

    const isOwner = rent.item.owner.id === currentUserId
    const isRenter = rent.renter.id === currentUserId

    if (!isOwner && !isRenter) {
      throw new Error("You don't have permission to do that")
    }

    return ctx.db.mutation.updateRent(
      {
        where: { id },
        data: {
          cancelled: true,
        },
      },
      info
    )
  },

  async reviewBooking(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const { id, rating } = args

    const booking = await ctx.query.booking(
      { where: { id } },
      '{ booker { id }, startDate, cancelled }'
    )

    // TODO: check if current user is booker

    // TODO: Check is start date is lapsed

    // ?: Do something with cancelled?

    return ctx.db.mutation.createBookingReview(
      {
        data: {
          rating,
          booking: {
            connect: {
              id,
            },
          },
          reviewer: {
            connect: {
              id: currentUserId,
            },
          },
        },
      },
      info
    )
  },
}

module.exports = Mutation
