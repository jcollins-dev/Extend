import React from 'react';

// machine states
import { default as RunningStateIcon } from './icons/state_running.svg';
import { default as CleaningStateIcon } from './icons/state_cleaning.svg';
import { default as StoppedByAlarmStateIcon } from './icons/state_stop_by_alarm.svg';
import { default as PausedStateIcon } from './icons/state_paused.svg';
import { default as IdleStateIcon } from './icons/state_idle.svg';
import { default as NotRunningStateIcon } from './icons/state_not_running.svg';
import { default as UnknownStateIcon } from './icons/state_unknown.svg';

interface MachineStateProps {
  state?: string;
}

export const MachineStateStatusIcon = ({ state }: MachineStateProps): JSX.Element => {
  if (!state) return <img src={UnknownStateIcon} />;

  //currently no api return states cleaning, paused, stop by alarms. These values cam efrom design

  switch (state.toLowerCase()) {
    case 'idle':
      return <img src={IdleStateIcon} alt={`machine state ${state}`} />;
    case 'stop':
      return <img src={StoppedByAlarmStateIcon} alt={`machine state ${state}`} />;
    case 'paused':
      return <img src={PausedStateIcon} alt={`machine state ${state}`} />;
    case 'cleaning':
      return <img src={CleaningStateIcon} alt={`machine state ${state}`} />;
    case 'unknown':
      return <img src={UnknownStateIcon} alt={`machine state ${state}`} />;
    case 'not running':
      return <img src={NotRunningStateIcon} alt={`machine state ${state}`} />;
    case 'running':
      return <img src={RunningStateIcon} alt={`machine state ${state}`} />;
    default:
      //return unknown
      return <img src={UnknownStateIcon} alt={`machine state ${state}`} />;
  }
};
