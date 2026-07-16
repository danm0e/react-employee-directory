import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "../schemas/employee.schema";
import { CREATE_EMPLOYEE } from "../graphql/queries";

interface CreateEmployeeResult {
  createUser: { id: string; name: string; email: string };
}

interface AddEmployeeFormProps {
  onSuccess?: (data: EmployeeFormValues) => void;
}

export function AddEmployeeForm({ onSuccess }: AddEmployeeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
  });

  // useMutation returns a tuple: [mutate function, result object]
  const [createEmployee] = useMutation<CreateEmployeeResult>(CREATE_EMPLOYEE);

  async function onSubmit(data: EmployeeFormValues) {
    // GraphQLZero mocks the mutation — it always returns id: "11".
    await createEmployee({
      variables: {
        input: {
          name: data.name,
          // username is required by GraphQLZero's CreateUserInput
          username: data.name.toLowerCase().replace(/\s+/g, "_"),
          email: data.email,
          phone: data.phone ?? "",
        },
      },
    });

    reset();
    onSuccess?.(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Add employee form"
      className="space-y-5"
    >
      {isSubmitSuccessful && (
        <div
          role="status"
          className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800"
        >
          Employee added successfully.
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={errors.name ? true : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={errors.email ? true : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("email")}
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="mt-1 text-sm text-red-600"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          aria-describedby={errors.phone ? "phone-error" : undefined}
          aria-invalid={errors.phone ? true : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("phone")}
        />
        {errors.phone && (
          <p
            id="phone-error"
            role="alert"
            className="mt-1 text-sm text-red-600"
          >
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="department"
          className="block text-sm font-medium text-gray-700"
        >
          Department <span aria-hidden="true">*</span>
        </label>
        <input
          id="department"
          type="text"
          aria-describedby={errors.department ? "department-error" : undefined}
          aria-invalid={errors.department ? true : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("department")}
        />
        {errors.department && (
          <p
            id="department-error"
            role="alert"
            className="mt-1 text-sm text-red-600"
          >
            {errors.department.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Adding…" : "Add Employee"}
      </button>
    </form>
  );
}
