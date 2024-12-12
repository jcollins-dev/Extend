import styled from 'styled-components';
import { Typography } from 'components';
import theme from 'themes';

export interface SVGIMGProps {
  swidth?: string;
  sheight?: string;
}
type Props = {
  left: string;
};
export const Root = styled.div`
  height: 90vh;
  margin: 0.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const StyledTypography = styled(Typography)`
  text-align: center;
`;
export const DashboardRowBottom = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 1rem;
  padding-bottom: 2rem;
  border-radius: 0.625rem;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 900px;
  justify-content: center;
  position: relative;
`;
export const DashboardRowTop = styled.div`
  height: auto;
  width: 100%;
  margin: 0.1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const DashboardHeader = styled.div`
  height: auto;
  width: 100%;
  margin: 0.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const DashboardImageWrapper = styled.div`
  position: absolute;
  top: -7.188rem;
  left: 88%;
  height: auto;
  width: auto;
  margin: 1rem;
  align-items: center;
  justify-content: center;
`;
export const DashBoadKiteWrapper = styled.div<Props>`
  position: absolute;
  top: 75%;
  left: ${({ left }) => {
    return left;
  }};
  margin: 1rem;
  align-items: center;
  justify-content: center;
`;
export const DashBoardIcon = styled.img<SVGIMGProps>`
  width: ${({ swidth }) => swidth}
  height: ${({ sheight }) => sheight}
`;
export const ImageWrapper = styled.div`
  margin-bottom: 1rem;
`;
export const DashBoardCard = styled.div`
  height: 12.5rem;
  width: 17.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 1.5rem;
  padding-left: 1.5rem;
  background-color: ${theme.colors.lightGrey1};
  cursor: pointer;
  box-shadow: 0 0.75rem 1.5rem 0.75rem #0000000d;
  &:hover {
    border: 0.125rem solid ${(props) => props.theme.colors.mediumBlue3};
  }
  border-radius: 5px;
  z-index: 1;
`;
