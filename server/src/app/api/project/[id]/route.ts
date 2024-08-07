import { type NextRequest } from 'next/server';
import { intFromString } from '../../validation';
import { respondWithError } from '../../errors';
import { fetchProject } from '../../../../db/shader';

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
    console.log('fetching project with id', id);
    const project = await fetchProject(id, { withFiles: true });
    console.log('result', project);
    return Response.json(project);
  } catch (error: unknown) {
    return respondWithError(error as Error);
  }
}
