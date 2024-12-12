// 3rd party libraries
import styled from 'styled-components';

interface Props {
  type?: 'PDF';
}
const DownloadLink = styled.a<Props>`
  display: block;
  color: #353b4b;
  margin: 0.25rem 0;
  font-size: 0.875rem;
  line-height: 1.25rem;

  &:before {
    vertical-align: middle;
    content: ${({ type }) => {
      switch (type) {
        case 'PDF':
          return "url('/assets/imgs/icons/pdf.png')";
        default:
          return "url('https://via.placeholder.com/20x22')";
      }
    }};
    margin-right: 0.625rem;
  }
`;
export default DownloadLink;
