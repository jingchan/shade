import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/join')({
  component: Join,
});

function Join() {
  return <>Join</>;
}
