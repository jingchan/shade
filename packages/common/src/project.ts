export interface Project {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export type ProjectData = Partial<
  Omit<Project, 'id' | 'owner_id' | 'created_at' | 'updated_at'>
>;

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
