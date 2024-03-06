import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PropsWithChildren, ReactElement, useEffect } from 'react';

export const DashboardProvider = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const { push } = useRouter();
  const { data: session } = useSession();

  // detect user role is match with route
  useEffect(() => {
    if (session?.user?.role !== AuthRole.ADMIN) {
      push('/app');
    }
  }, [session, push]);

  return <>{children}</>;
};
