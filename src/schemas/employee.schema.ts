// Session 2 homework: define the Zod validation schema for the Add Employee form.
//
// Requirements:
//   - Import z from "zod"
//   - Define employeeFormSchema using z.object() with rules for:
//       name:       required string
//       email:      required, valid email format
//       phone:      optional; validate format if provided
//       department: required string
//   - Export EmployeeFormValues as: z.infer<typeof employeeFormSchema>
//
// Reference: Session 2 slides — "Zod Schema — employee.schema.ts"

export {};
