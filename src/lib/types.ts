import z, { email } from "zod"

export const SinginInputTypes = z.object({
    email:z.email(),
    password : z.string()
})

export const SingupInputs = z.object({
         name:z.string(),
         password:z.string(),
         email:z.email(),
         created_at: Date,
        })