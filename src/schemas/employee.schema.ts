import { z } from "zod";

export const employeeFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+().]{7,20}$/.test(val),
      "Enter a valid phone number",
    ),
  department: z.string().min(1, "Department is required"),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
