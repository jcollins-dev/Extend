import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faArrowRight,
  faChevronDown,
  faPencil,
  faWarning,
  faCalendar,
  faInfo
} from '@fortawesome/free-solid-svg-icons';
import { styledTheme } from 'components/StyledUi/theme';
import { AlertTypeProps } from './Styled.types';

export const Calendar = styled(FontAwesomeIcon).attrs(() => ({ icon: faCalendar }))``;
export const ChevRight = styled(FontAwesomeIcon).attrs(() => ({ icon: faChevronRight }))``;
export const ChevDown = styled(FontAwesomeIcon).attrs(() => ({ icon: faChevronDown }))``;
export const ArrowRight = styled(FontAwesomeIcon).attrs(() => ({ icon: faArrowRight }))``;
export const AdminEdit = styled(FontAwesomeIcon).attrs(() => ({ icon: faPencil }))``;
export const InfoIcon = styled(FontAwesomeIcon).attrs(() => ({ icon: faInfo }))`
  width: 8px;
  padding: 2px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid ${styledTheme.color.main};
`;

export const Alert = styled(FontAwesomeIcon).attrs(() => ({ icon: faWarning }))<AlertTypeProps>`
  color: ${styledTheme.color.status.error.base};
`;
