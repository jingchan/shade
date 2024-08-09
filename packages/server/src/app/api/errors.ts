export class NoProjectError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NoProjectError';
  }
}
export class LoginError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'LoginError';
  }
}

export class SignUpError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'SignupError';
  }
}

export function respondWithError(error: Error) {
  if (error.code && error.code === 'ECONNREFUSED') {
    console.log('Server error:', error);
    return Response.json(
      {
        error: 'Internal server error.',
      },
      { status: 500 },
    );
  }
  console.log('Unhandled error:', error, typeof error);
  return Response.json(
    {
      error: error.name,
    },
    { status: 500 },
  );
}
