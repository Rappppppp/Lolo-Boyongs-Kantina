import { z } from "zod"

export const registerSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        const requirements = [
            {
                test: (pw: string) => pw.length >= 8,
                message: "Must be at least 8 characters",
            },
            {
                test: (pw: string) => /[A-Z]/.test(pw),
                message: "Must include at least one uppercase letter",
            },
            {
                test: (pw: string) => /[a-z]/.test(pw),
                message: "Must include at least one lowercase letter",
            },
            {
                test: (pw: string) => /\d/.test(pw),
                message: "Must include at least one number",
            },
            {
                test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
                message: "Must include at least one special character",
            },
        ]

        // Collect all failed validations
        requirements.forEach((rule) => {
            if (!rule.test(password)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: rule.message,
                    path: ["password"],
                })
            }
        })

        // Confirm password match
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passwords do not match",
                path: ["confirmPassword"],
            })
        }
    })


export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password is required"),
});