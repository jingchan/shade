export class NoProjectError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectNotFound';
  }
}

export function respondWithError(error: Error) {
  return Response.json({
    error: error.name,
    message: error.message,
  });
}
