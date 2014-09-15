# Introduction

We launched the Layer Early Access beta program in November 2013. Since then, we have had the opportunity to work closely with many development partners who are building amazing mobile applications on top of our communications platform. Early Access customers have provided incredibly valuable feedback on our product throughout this process, and we have learned a great deal about their specific needs. 

As a result of this feedback, we have been working over the last few months to dramatically improve the performance of our platform and the simplicity of our mobile SDKs. Layer v0.8 represents a significant overhaul of our communications platform. We have re-architected our service to be faster, more secure, and more reliable. We have also redesigned our mobile SDKs to be more lightweight and intuitive to use. The changes in this release and the corresponding benefits are significant.  

## Changes Include

  1. **New Authentication Flow** - Allows you to fully manage user identity without sharing credentials and enhances client security.
  2. **SDK Interface Consistency and Simplification - **Contributes to a more seamless integration across Layer platforms with less cognitive overhead.
  3. **Separation of Application Model from Synchronization Logic **- Provides for a richer application interface that can be iterated independently of internal protocols.
  4. **Simplified Client-server Synchronization** - Makes message transfer more robust in the face of network failures, and optimizes incremental updates.
  5. **Updated Network Transport Protoco**l - Optimized for mobile, including features important for mobile networks, such as request prioritization and channel level flow control.
  6. **Replacement Storage Back End** - Storage has been re-architected with greatly improved scalability, manageability and performance characteristics with a focus on geographically distributed deployments.

Layer v0.7.0 **will introduce a number of breaking changes to your current implementation.** In order to provide a straightforward migration process, we have opted to include all of these enhancements in a single release that can be processed all at once. This document details the changes that will affect your current Layer integration. We have also put together a new [Integration guide](/docs/integration) which will help make the transition from our beta SDK to our v0.8 SDK as seamless as possible. 

## Existing Message Data 

Throughout the Early Access period, we gained invaluable insight into the storage, performance, and access characteristics necessary to support Layer applications at scale. This knowledge has driven a significant evolution of the persistence layer that underlies the messaging system. Because of this evolution, concurrent with the release of Layer v0.X we will deploy a new, backwards incompatible storage layer. All existing user and message data will be deleted after a brief transition period as a result of this deployment. Should you wish to retain this data for any reason, please [contact us](mailto:support@layer.com) and we will gladly create a backup of your data.
