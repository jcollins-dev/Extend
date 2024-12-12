import styled from 'styled-components';

export const MachineStateContainer = styled.div`
  display: flex;
  align-items: center;
  border-left: solid 2px #828285;
  padding-left: 0.5em;

  .state {
    font-weight: 500;
    padding: 0 0.45rem;
  }

  .idle {
    color: #000000;
  }

  .state.no.product,
  .state.stop.by.alarm {
    color: #ba4e00;
  }

  .state.running {
    color: #008200;
  }

  .unknown {
    color: #ba4e00;
  }
`;

export const MachineStatusContainer = styled.div`
  display: flex;

  .machine_status {
    font-weight: 500;
  }

  .machine_status.connected {
    color: #008200;
  }

  .machine_status.disconnected {
    color: #b62c10;
  }

  .icon {
    padding: 0 0.2rem;
    width: 16px;
    height: 16px;
  }

  .last_known_connected {
    font-size: 14px;
    font-weight: 100;
    color: #828485;
  }
`;
