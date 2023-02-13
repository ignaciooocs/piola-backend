export const userPopulate = [
  {
    path: 'comments',
    select: {
      comment: 1,
      by: 1,
      createdAt: 1
    }
  },
  {
    path: 'likes',
    select: {
      fromUser: 1,
      toUser: 1
    }
  },
  {
    path: 'liked',
    select: {
      fromUser: 1,
      toUser: 1
    }
  },
  {
    path: 'notifications',
    select: {
      fromUser: 1,
      toUser: 1,
      type: 1,
      createdAt: 1
    }
  },
  {
    path: 'stories',
    select: {
      by: 1,
      comment: 1,
      user: 1,
      response: 1,
      color: 1
    }
  }
]
