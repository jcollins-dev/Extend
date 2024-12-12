import { useLocation } from 'react-router';

export type UseRouterReturnProps = Record<string, unknown>;

export const useRouter = (paths: string): UseRouterReturnProps => {
  const { pathname } = useLocation();

  const urlSlugs = pathname.split('/').filter((slug) => slug !== '');
  const basePaths = paths.split('/').filter((slug) => slug !== '');

  const pathIndex: Record<number, string> = basePaths.reduce(
    (acc, path, index) => (acc = { ...acc, [index]: path }),
    {}
  );

  return urlSlugs.reduce((acc, slug, index) => {
    const pathKey = pathIndex[index];
    return (acc = { ...acc, [pathKey]: slug });
  }, {});
};
