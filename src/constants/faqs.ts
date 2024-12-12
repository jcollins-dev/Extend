import { FAQItemProps, FAQCategories } from 'types';
import Logo from '../img/OmniBlu-Logo-Compact.svg';
import maintainenceIcon from '../img/maintainence.svg';
import fleetIcon from '../img/fleet.svg';
import partsIcon from '../img/partsIcon.svg';

const generalFAQs: FAQItemProps[] = [
  {
    question: 'What is the OmniBlu app?',
    answers: [
      'The OmniBlu app is a digital tool created to optimize your production performance. You can seamlessly manage your inventory through our "Frictionless parts & service" ordering platform and monitor tech hardware and alerts to rapidly identify and resolve issues through our "Machine performance" AI connected system.'
    ],
    subanswers: ['']
  },
  {
    question: 'What do I do if I find a bug?',
    answers: [
      'We are constantly aiming to improve this app! If you encounter any defects, please email your customer care representative a brief description, steps to reproduce the issue, and screenshots to help us troubleshoot.'
    ],
    subanswers: ['']
  }
];

// const appSupportFAQs: FAQItemProps[] = [
//   {
//     question: 'What do I do if I find a bug?',
//     answers: [
//       'We are constantly aiming to improve this app! If you encounter any defects, please email your customer care representative a brief description, steps to reproduce the issue, and screenshots to help us troubleshoot.'
//     ],
//     subanswers: ['']
//   }
// ];

// const acceptablePolicyFAQs: FAQItemProps[] = [
//   {
//     question: 'OmniBlu Acceptable Use Policy',
//     answers: [
//       'Please read this acceptable use policy ("policy", “AUP”) carefully before using OmniBlu. Services provided by us may only be used for lawful purposes. You agree to comply with all applicable laws, rules, and regulations in connection with your use of the services. Any material or conduct that in our judgment violates this policy in any manner may result in suspension or termination of the services or removal of user’s account with or without notice.',
//       'Prohibited use::',
//       'You may not use the services to publish content or engage in activity that is illegal under applicable law, that is harmful to others, or that would subject us to liability, including, without limitation, in connection with any of the following, each of which is prohibited under this AUP:',
//       '- Do not share login credentials',
//       '- Use a unique password for OmniBlu',
//       '- Keep your web browser and any extension up to date with the latest security patches',
//       'Enforcement::',
//       'Your services may be suspended or terminated with or without notice upon any violation of this policy. Any violations may result in the immediate suspension or termination of your account.',
//       'Reporting::',
//       'Suspected security incidents should be reported to omniblu-cybersecurity@jbtc.com. Potential security vulnerabilities in custom developed code should be reported omniblu-app-security@jbtc.com. We reserve the right to change this policy at any given time, of which you will be promptly updated. If you want to make sure that you are up to date with the latest changes, we advise you to frequently visit this page. '
//     ],
//     subanswers: ['']
//   }
// ];

const fleetFAQs: FAQItemProps[] = [
  {
    question: 'What type of information is displayed within the Fleet dashboard for freezers?',
    answers: [
      'The fleet dashboard has a site view and a line view. The site view shows high level production KPIs and status for every connected machine associated with your account. The line view provides additional details on and visualization of machines in a specific line with the ability to compare line status.'
    ],
    subanswers: ['']
  },
  {
    question:
      'What type of information is displayed within the Fleet dashboard for Avure machines?',
    answers: [
      'The fleet dashboard shows high level production and health KPIs for every connected machine associated with your account, as well as the state condition of each machine.'
    ],
    subanswers: ['']
  },
  {
    question: 'What are the different tabs within the Fleet dashboard for freezers?',
    answers: [
      'The "Machine Overview" tab provides an overview of KPIs, production metrics, utilization, recent cleaning, and recent alarms.',
      'The "Product Processing" tab displays an overview of systems related to product processing (e.g. climate system for freezers) and includes more detailed KPIs, historical trends overtime, alarm overlays and system states.',
      'The "Product Movement" tab shows an overview of systems related to product movement (e.g. drives & belt for freezers) and includes more detailed KPIs, historical trends overtime, alarm overlays and system states.',
      'The "Cleaning" tab provides single session and over time information, which is toggleable. Single session shows details on steps in an individual cleaning session and displays step duration compared to average, alarm callouts, and utility use KPIs. Steps over time aggregates multiple cleaning sessions, allowing for analysis of step duration and cleaning alarm frequency. In the future, utility use will also be summarized in this tab.',
      'The "Alarms" tab displays active alarms and historic makeup of alarms. Clicking on active alarms gives suggestions on how to resolve the issues.'
    ],
    subanswers: ['']
  },
  {
    question: 'What are the different tabs within the Fleet dashboard for Avure machines?',
    answers: [
      'The "Machine Overview" tab provides an overview of KPIs, such as weight/cycle, cycles, and weight time/cycle for a machine over times and shifts.',
      'The "Machine Production" tab displays KPIs and state metrics relevant to the PLUs per cycle for a machine (e.g., fail cycles) with status checks. Future enhancements will include bar graphs of KPI data to show historical performance over time and moments in time when KPIs were underperforming.',
      'The "Machine Health" tab shows detailed KPIs and states for sub-components for a machine (e.g., intensifiers, decomp valves) with status checks, warning icons, and descriptions to help navigate the detected issues. Future enhancements will include trend lines to display historical health over time and flag moments in time when KPIs were outside of normal ranges.',
      'The future "Data Analysis" tab will display a graph which overlays failed/successful cycles with alarms, as well as a table of historical alarms.'
    ],
    subanswers: ['']
  }
];

const maintenanceFAQs: FAQItemProps[] = [
  {
    question: 'What types of events are shown within Maintenance?',
    answers: [
      'The goal of the maintenance manager is to provide a unified list of maintenance events for your JBT machines to help you transition from majority-reactive maintenance to preventative maintenance.'
    ],
    subanswers: ['']
  },
  {
    question: 'What are the different tabs within Maintenance Manager?',
    answers: [
      'Maintenance events are presented across three tabs (Access by clicking the tabs "Now", "Upcoming", and "Resolved" at the top of the screen):'
    ],
    subanswers: [
      'The "Now" tab shows maintenance events that are due within the next seven days and maintenance events that are overdue.',
      'The "Upcoming" tab shows future maintenance events that are beyond one week out. This tab is meant to provide a maintenance planner visibility to events on the horizon (including major rebuilds) to enable them to buy any parts necessary for these events and to schedule time intensive events around intentional downtime. The "Require immediate action" section of this tab is where you are prompted to buy parts for upcoming maintenance events. You are prompted ahead of time so that the parts arrive prior to the scheduled maintenance event.',
      'The "Resolved" tab shows a historical view of completed maintenance events.'
    ]
  },
  {
    question: 'How do I manage specific maintenance events?',
    answers: [
      'Maintenance events can be managed through 4 tasks. To access tasks click the arrow on the right side of a specific maintenance event to bring up a side-view:'
    ],
    subanswers: [
      '"Order PM Kit" is where you can add upcoming PM kits to your cart.',
      '"Assign & Schedule" is where you can assign someone to complete the maintenance event and schedule a date other than the date that is calculated from the interval in case the calculated date does not line up with planned downtime.',
      '"Mark Complete" is where you can mark maintenance events as complete or not complete. The completion date or the completion run metric are used to calculate the future interval.',
      '"Create follow up" is where you can create a new maintenance event as a result of another PM (e.g. Inspection PM reveals a part is broken and needs to be replaced).'
    ]
  },
  {
    question: "Where can I find my machine's maintenance manual?",
    answers: ['Under Maintenance, you can click on Manuals.'],
    subanswers: ['']
  }
];

const partsFAQs: FAQItemProps[] = [
  {
    question: 'Where do I find different types of parts?',
    answers: ['There are three places you may find parts:'],
    subanswers: [
      'Spare parts are displayed in the clickable diagrams. Click "Parts" on the side bar and choose your machine to view diagrams.',
      'PM kits within the maintenance manager list parts',
      'All other parts may be found through the search bar. Click "Parts" and scroll down to find the search bar.'
    ]
  },
  {
    question: 'Why are the bubbles in the clickable diagrams different colors?',
    answers: [
      'Clicking on a blue bubble brings up part information and the option to add to cart. Green bubbles zoom in on a machine and reveal more clickable parts. Gray bubbles bring up non-purchasable parts or parts with missing information.'
    ],
    subanswers: ['']
  },
  {
    question:
      'Price, stock, or lead time is missing for a part. Where can I find this information?',
    answers: [
      'Click "Help" on the side bar to find phone numbers and email addresses for your JBT parts rep.'
    ],
    subanswers: ['']
  },
  {
    question: 'What happens when I submit for a quote?',
    answers: [
      'Your quote will be sent to your JBT parts rep for validation. Once validated, your quote will be entered into JBT systems for fulfillment.'
    ],
    subanswers: ['']
  },
  {
    question: 'Where can I find my previous Orders?',
    answers: ['Under "Parts" click "Orders" to see a list of your most recent orders.'],
    subanswers: ['']
  }
];

export const FAQItems: FAQCategories[] = [
  // {
  //   category: 'Acceptable Use Policy',
  //   faqs: acceptablePolicyFAQs
  // },
  {
    category: 'General',
    faqs: generalFAQs,
    icon: Logo
  },
  // {
  //   category: 'App Support',
  //   faqs: appSupportFAQs
  // },

  {
    category: 'Fleet Support',
    faqs: fleetFAQs,
    icon: fleetIcon
  },
  {
    category: 'Maintenance',
    faqs: maintenanceFAQs,
    icon: maintainenceIcon
  },
  {
    category: 'Parts',
    faqs: partsFAQs,
    icon: partsIcon
  }
];
