import styled from 'styled-components';
import { Button } from 'components';
import { SVGIMGProps } from 'pages/Dashboard/DashboardStyledComponents';
export const AlertsWelcomeMsgContainer = styled.div`
  height: auto;
  width: 100%;
  margin: 0.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 8rem;
`;
export const StyledButton = styled(Button)`
  border-radius: 50px;
  margin-top: 0.8rem;
`;
export const AlertBoardIcon = styled.img<SVGIMGProps>`
  width: ${({ swidth }) => swidth}
  height: ${({ sheight }) => sheight}
  margin-bottom: 4rem;
  margin-top: 2.5rem;
`;
export const ImageWrapper = styled.div`
  margin-bottom: 1rem;
`;
