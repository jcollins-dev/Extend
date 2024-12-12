import styled from 'styled-components';

export type ColumnProps = {
  size?: number;
  className?: string;
};

const StyledDiv = styled.div<ColumnProps>`
  flex: ${(props) => (props.size ? props.size : 'auto')};

  &.has-large-text {
    .kpi-card__value {
      font-size: clamp(20px, 4vw, 50px);
    }

    .kpi-card__unit {
      font-size: 0.7em !important;
    }

    @media screen and (max-width: 900px) {
      .kpi-card__value {
        font-size: 35px;
      }
    }
  }

  &.has-md-text {
    .kpi-card__value {
      font-size: clamp(18px, 3vw, 38px) !important;

      .kpi-card__unit {
        font-size: 0.7em !important;
      }
    }

    .kpi-card--oee-widget {
      .kpi-card__value {
        margin-bottom: 0;
      }
    }
  }
`;

export default StyledDiv;
