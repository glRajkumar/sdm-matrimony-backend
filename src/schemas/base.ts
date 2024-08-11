import { Type } from "@sinclair/typebox";

export const str = Type.String()
export const num = Type.Number()
export const bool = Type.Boolean()

export const _id = Type.Object({
  _id: str
})

export const strArr = Type.Array(Type.String())
export const numArr = Type.Array(Type.Number())

export const successMsg = Type.Object({
  msg: Type.String(),
})
