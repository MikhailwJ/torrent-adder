import Options from '@src/components/Options';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <Options>
        <Outlet />
        <TanStackRouterDevtools />
      </Options>
    </>
  ),
});
