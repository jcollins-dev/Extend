import { RouterTabNavTabProps } from '../RouterTabNav';

export const routerTabsDemoData: RouterTabNavTabProps[] = [
  {
    label: `Machine Health`,
    slug: `machine-health`
  },
  {
    label: `Machine Production`,
    slug: `machine-production`
  },
  {
    label: `Function Click`,
    slug: `function-click`,
    handleClick: (x: string) => alert(`${x} has been clicked`)
  },
  {
    label: `Alerts`,
    slug: `alerts`,
    isDisabled: true
  },
  {
    label: `Custom Range`,
    slug: `custom-range`
  }
];
