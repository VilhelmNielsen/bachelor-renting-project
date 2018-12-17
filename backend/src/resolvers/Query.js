const { forwardTo } = require('prisma-binding')
const getUserId = require('../utils/getUserId')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  categories: forwardTo('db'),
  categoriesConnection: forwardTo('db'),

  async me(_, args, ctx, info) {
    const currentUserId = getUserId(ctx, { throwError: false })

    if (!currentUserId) {
      return null
    }

    const user = await ctx.db.query.user(
      {
        where: { id: currentUserId },
      },
      info
    )

    return user
  },
}

module.exports = Query
