import { ApiError, Project } from '@/project';

const API_HOST = 'http://localhost:3001';

export async function getProjectsForUser(_user_id: number): Promise<Project[]> {
  try {
    const res = await fetch(`${API_HOST}/api/project`);
    return res.json();
  } catch (error: unknown) {
    throw new ApiError('Failed to fetch projects');
  }
}
