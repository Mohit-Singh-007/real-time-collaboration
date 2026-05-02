import z from "zod";

export const inviteSchema = z.object({
    email: z.string().email("Email is required..."),
    role: z.enum(["EDITOR","VIEWER"])
})

export type InviteUser = z.infer<typeof inviteSchema>