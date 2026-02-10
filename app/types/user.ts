export type Role = "admin" | "user" | "rider"

export type Rider = {
  id: number;
  name: string;
  phone: string;
}

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    // confirm_password?: string;
    phone_number?: string;
    street_address?: string;
    barangay?: string;

    role: Role;
}