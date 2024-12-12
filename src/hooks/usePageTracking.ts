import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateAnalyticsPageView } from 'helpers/analytics';

const usePageTracking = (): void => {
  const location = useLocation();

  useEffect(() => {
    generateAnalyticsPageView(location.pathname);
  }, [location]);
};

export default usePageTracking;
