
export const userSchema = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  }
};

export const createUserSchema = {
  body: userSchema,
  response: {
    201: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      }
    },
  },
};

export const loginUserSchema = {
  body: userSchema,
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    }
  }
};
