// 3rd party libraries
import { useLocation } from 'react-router-dom';

export default function useQueryParams(): URLSearchParams {
  const location = useLocation();
  return new URLSearchParams(location.search);
}
