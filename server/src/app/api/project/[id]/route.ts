import { type NextRequest } from 'next/server';
import { intFromString } from '../../validation';
import { respondWithError } from '../../errors';
import { getProject } from '@/db/project';

// async function fetchProjectWithLatestFiles(id: number) {
//   const project = await fetchProject(id);
//   if (!project) {
//     throw new NoProjectError(`Project with id ${id} not found.`);
//   }
//   fetch;
//   return project;
// }

// Obtain a project by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = intFromString(params.id);
    console.log(id);

    const project = await getProject(id);
    console.log(project);
    return Response.json(project);
  } catch (error: unknown) {
    return respondWithError(error as Error);
  }
}
