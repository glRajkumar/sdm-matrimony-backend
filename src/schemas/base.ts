export const str = { type: 'string' }
export const num = { type: 'number' }
export const bool = { type: 'boolean' }

export const strArr = {
  type: 'array',
  items: str,
}

export const successMsg = {
  type: 'object',
  properties: {
    msg: str
  }
}
