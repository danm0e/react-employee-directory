import type { Meta, StoryObj } from "@storybook/react";
import { EmployeeCard } from "./EmployeeCard";

const meta: Meta<typeof EmployeeCard> = {
  title: "Components/EmployeeCard",
  component: EmployeeCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof EmployeeCard>;

const sampleEmployee = {
  id: 1,
  name: "Leanne Graham",
  email: "sincere@april.biz",
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: { name: "Romaguera-Crona" },
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
  },
};

export const Default: Story = {
  args: {
    employee: sampleEmployee,
  },
};

export const WithClickHandler: Story = {
  args: {
    employee: sampleEmployee,
    onClick: () => console.log("Card clicked"),
  },
};
