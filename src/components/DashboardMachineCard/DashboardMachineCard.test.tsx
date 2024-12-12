import React from 'react';
import ReactDOM from 'react-dom';
import { MachineBusinessUnit, MachineStatus } from 'types';
import DashboardMachineCard from './DashboardMachineCard';

const machine = {
  id: '1',
  sku: '111111',
  name: `Kent's EZ Bake Oven`,
  description: `Kent's EZ Bake Oven`,
  plantId: '1', // link to plant
  orgId: '1', // link to organization (company)
  status: MachineStatus.Healthy,
  purchased: new Date(),
  installed: new Date(),
  warrantyExpired: new Date(),
  nickname: `Kent's machine`,
  throughput: ['5600', '3000', '1060', '5689'],
  lineSpeed: ['104', '200', '145'],
  downtime: ['2:14:12', '2:35:11'],
  businessUnit:('avure' as MachineBusinessUnit)
};

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DashboardMachineCard machine={machine} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
