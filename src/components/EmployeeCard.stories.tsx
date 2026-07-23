import type { Meta, StoryObj } from "@storybook/react";
import { EmployeeCard } from "./EmployeeCard";

// The meta object registers this component in Storybook's sidebar.
// tags: ["autodocs"] generates a documentation page from EmployeeCardProps.
// Reference: Session 1 slides — "In Our Project — Storybook Autodocs"
const meta: Meta<typeof EmployeeCard> = {
  title: "Components/EmployeeCard",
  component: EmployeeCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof EmployeeCard>;

// TODO: Export at least two named story variants: Default and WithClickHandler.
// Once EmployeeCard accepts props, pass a sample employee via args:
//   export const Default: Story = { args: { employee: { id: 1, name: "Leanne Graham", ... } } };
export const Default: Story = {};
