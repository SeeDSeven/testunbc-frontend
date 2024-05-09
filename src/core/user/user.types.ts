import { Group } from "./user-groups.types";

export interface User
{
  id: number;
  name: string;
  email: string;
  password: string;
  updated_at: Date;
  created_at: Date;
}
