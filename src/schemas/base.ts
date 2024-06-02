import { Static, Type } from "@sinclair/typebox";

export const str = Type.String()
export const num = Type.Number()
export const bool = Type.Boolean()

export const strArr = Type.Array(Type.String())
export const numArr = Type.Array(Type.Number())

export const successMsg = Type.Object({
  msg: Type.String(),
})

export type strArrType = Static<typeof strArr>
export type numArrType = Static<typeof numArr>
export type successMsgType = Static<typeof successMsg>
