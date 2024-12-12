# Choose analytics library for analytics POC

- Status: proposed
- Deciders: James Graham, Kent Vasko, Mike Boselowitz
- Date: [2022-03-28]
- Tags: analytics,POC,product

User Story: https://dev.azure.com/jbtciops/Extend/_workitems/edit/2417

## Context and Problem Statement

Now that the application is in the hands of customers at Hydrofresh, how can we monitor how they use the application? Is there an automated analytics library we could use to track user behavior?

## Decision Drivers

- Short time horizon needed for POC
- Concern about ecosystem -- should we be using something within Azure? Will that play nicer or less nice with our existing code?
- How to use whatever analytics software we choose in compliance with GDPR and other applicable regulations?

## Considered Options

- Google Analytics
- Azure Application Insights

## Decision Outcome

**Chosen option: Google Analytics**

Google Analytics provides a comprehensive solution to usage-based monitoring with easy integration to our existing codebase. Additionally, their reporting functionality is far more business-user friendly and likely to drive deep insights from JBT busineses analyists than the equivalent functionality on Azure App Insights.

### Positive Consequences

- Analytics software allows us more fine-grained user metrics than simply looking at server logs
- Many analytics solutions are SaaS offerings with easy integrations, ideally easily maintainable and expandable within our current codebase
- Reports generated by the analytics solution can

### Negative Consequences

- Potential risk to OmniBlu adoption due to customer sensitivty about user analytics
- Potential legal risk if analytics deployed without proper safeguards as relates to GDPR, CCPA, and other applicable regulation
- Additional library and integration to maintain may hurt code cleanliness, maintainability, or developer onboarding.

## Pros and Cons of the Options <!-- optional -->

### Azure Application Insights

Azure offers a solution within the Azure Cloud ecosystem for aggregating user-based metrics into their Application Insights (App Insights) software. App Insights is a centralized repository for all types of logs, including server/uptime logs, debug logs, and even usage tracking. It is well integrated with other Azure services -- indeed our server logs are automatically added to App Inights today -- and offers out-of-the box visualizations for the aggregated logs.

**Pros:**

- Already part of the Azure Cloud Ecosystem, which means more robust support from our existing Microsoft relationship
- App Insights is a mature codebase, and the integration libraries are unlikely to be deprecated in the near future
- Potential opportunity to correlate usage-based metrics with server metrics, uptime, etc.
- Current dev team on JBT and BCG sides have experience with Google Analytics

**Cons:**

- App Insights is a product geared towards server logging and uptime metrics, and thus has limited support for usage-based aggregations and reporting
- Reporting tools are not business-analyst friendly, which would make deeper usage insights harder to draw
- Integration with their library not as simple/clean as Google Analytics
- No developer experience or familiarity with this solution on the JBT or BCG teams

**Links:**

- [Overview](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

- [Javascript Plugin](https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript-react-plugin)

### Google Analytics 4

Google Analytics is the industry-leader in usage and demographic based tracking for not only web applications, but native mobile applications, and even game engines such as Unity and Unreal Engine. It offers simple integration with existing web frameworks such as React, and powerful reporting tools that are business user friendly. It has no provision for aggregating non-usage based metrics, although custom events are supported. Google Analytics has mature documentation and guides for integration, and the development team on the BCG and JBT side already have experience with its usage.

**Pros:**

- Powerful automatic event tracking for core usage based metrics like page views, location tracking, etc.
- Well defined interfaces for custom eventing, and reporting off custom events
- Reporting tools are business-user friendly, allowing deep insights to be drawn without developer analysis
- Strong support for e-commerce functionality, with the ability to estimate revenue in reports using e-commerce events
- Broad base of experience on the BCG and JBT teams to support rapid integration

**Cons:**

- Does not exist in the Azure ecosystem, and is thus another third party to integrate with
- Google has an increasingly toxic reputation for aggressively collecting private data, and using GA4 may lead customers to see our application as "creepy"
- `react-ga4`, the library we want to use to integrate, is a community-supported library and not maintained by Google
- Potentially keeps PII in a unavoidable way, leading to issues with GDPR compliance

**Links:**

- Google maintains a list of suggested custom events [here](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [react-ga4](https://www.npmjs.com/package/react-ga4) and [react-ga](https://github.com/react-ga/react-ga)