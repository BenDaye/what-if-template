import nextI18NextConfig from '@/../next-i18next.config';
import { NextPageWithLayout } from '@/pages/_app';
import { Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Page: NextPageWithLayout = () => {
  return <Typography variant="h4">What If</Typography>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  return {
    props: {
      ...(await serverSideTranslations(
        context.locale ?? 'zh',
        undefined,
        nextI18NextConfig,
      )),
    },
  };
};

export default Page;
