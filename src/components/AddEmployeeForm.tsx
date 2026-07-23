// Session 2 homework: build a validated, accessible Add Employee form.
//
// Requirements:
//   - Import useForm from "react-hook-form" and zodResolver from "@hookform/resolvers/zod"
//   - Import employeeFormSchema and EmployeeFormValues from "../schemas/employee.schema"
//   - Set up useForm<EmployeeFormValues> with resolver: zodResolver(employeeFormSchema)
//   - Add four labelled fields: name, email, phone, department
//   - Each field needs: <label htmlFor="id">, <input id="id" {...register("field")} />,
//     and an error message: <p id="field-error" role="alert">{errors.field?.message}</p>
//   - Set aria-invalid and aria-describedby on inputs that have an error
//   - POST to https://jsonplaceholder.typicode.com/users in onSubmit, call reset() on success
//   - Show a success banner when isSubmitSuccessful is true
//   - Disable the submit button while isSubmitting
//
// Reference: Session 2 slides — "React Hook Form — The Core API"
//            Session 2 slides — "Form Accessibility — The Fundamentals"

export function AddEmployeeForm() {
  return null;
}
