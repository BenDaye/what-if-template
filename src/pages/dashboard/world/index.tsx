import nextI18NextConfig from '@/../next-i18next.config';
import { DashboardLayout } from '@/components/layouts';
import { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma, redis } from '@/server/modules';
import { appRouter } from '@/server/routers/_app';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuperJSON from 'superjson';

const Page: NextPageWithLayout = () => {
  return <>World Page</>;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session,
      redis,
      prisma,
    },
    transformer: SuperJSON,
  });

  await helpers.publicDashboardMeta.get.prefetch();

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale ?? 'zh',
        undefined,
        nextI18NextConfig,
      )),
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Page;
