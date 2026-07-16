import type { Meta, StoryObj } from "@storybook/react";
import { AddEmployeeForm } from "./AddEmployeeForm";

const meta: Meta<typeof AddEmployeeForm> = {
  title: "Components/AddEmployeeForm",
  component: AddEmployeeForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AddEmployeeForm>;

export const Default: Story = {};

export const WithSuccessCallback: Story = {
  args: {
    onSuccess: (data) => console.log("Employee added:", data),
  },
};
