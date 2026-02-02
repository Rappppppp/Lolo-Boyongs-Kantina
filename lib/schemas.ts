import { z } from "zod"

export const registerSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
        phone_number: z
            .string()
            .regex(/^(09\d{9}|9\d{9}|639\d{9}|\+639\d{9})$/, {
                message:
                    "Invalid phone number format. Please use Philippine number format.",
            }),
        street_address: z.string().min(1, "Street address is required"),
        barangay: z.string().min(1, "Barangay is required"),
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

export const userSchema = z.object({
    id: z.number().optional(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Must be a valid email"),
    role: z.enum(["user", "rider", "admin"]),
    phone_number: z.string().optional(),
    street_address: z.string(),
    barangay: z.string(),
    password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")), // allow empty string for optional password
})

export const reservationSchema = z.object({
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => {
      const selected = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, "Date cannot be in the past"),

  time: z
    .string()
    .min(1, "Time is required")
    .refine((val) => {
      const [hours, minutes] = val.split(":").map(Number)
      const totalMinutes = hours * 60 + minutes

      const open = 10 * 60 // 10:00 AM
      const close = 20 * 60 // 8:00 PM

      return totalMinutes >= open && totalMinutes <= close
    }, "Time must be between 10:00 AM and 8:00 PM"),

  guests: z
    .string()
    .min(1)
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "Guests must be a number")
    .refine((val) => val >= 1, "At least 1 guest required")
    .refine((val) => val <= 20, "Maximum of 20 guests"),
})


// export const addCategorySchema = z.object({
//     name: z.string().min(3, "Name is required"),
//     description: z.string().min(3, "Description is required"),
// });