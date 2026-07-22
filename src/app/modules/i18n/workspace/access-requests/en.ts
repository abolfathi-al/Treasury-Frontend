export const accessRequestsWorkspaceEn = {
  title: "Access Requests",
  navTitle: "Access Requests",
  breadcrumb: "Access Requests",
  helperText: "View, review, and manage access requests in this workspace.",
  summary: {
    totalRequests: "Total Requests",
    totalRequestsDetail: "Across workspace",
    pending: "Pending",
    pendingDetail: "30% of total",
    approved: "Approved",
    approvedDetail: "56% of total",
    denied: "Denied",
    deniedDetail: "8% of total",
    awaitingMyAction: "Awaiting My Action",
    awaitingMyActionDetail: "14% of total",
    averageResponseTime: "Avg. Response Time",
    averageResponseTimeDetail: "0.6 days faster"
  },
  filters: {
    searchLabel: "Search",
    searchPlaceholder: "Search requests, actors, resources...",
    status: "Status",
    allStatuses: "All Statuses",
    requestedBy: "Requested By",
    allActors: "All Actors",
    resourceType: "Resource Type",
    allTypes: "All Types",
    priority: "Priority",
    allPriorities: "All Priorities",
    moreFilters: "More Filters",
    export: "Export"
  },
  table: {
    title: "Access Requests ({{count}})",
    requestId: "Request ID",
    requestedBy: "Requested By",
    resource: "Resource",
    accessType: "Access Type",
    scope: "Scope",
    priority: "Priority",
    status: "Status",
    requestedOn: "Requested On",
    actions: "Actions",
    showing: "Showing 1 to 8 of {{count}} results",
    pageSize: "10 / page"
  },
  status: {
    pending: "Pending",
    approved: "Approved",
    denied: "Denied",
    cancelled: "Cancelled"
  },
  priority: {
    title: "Requests by Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    countSummary: "{{count}} ({{percent}}%)"
  },
  accessTypes: {
    read: "Read",
    write: "Write",
    execute: "Execute",
    roleAccess: "Role Access",
    resourceAccess: "Resource Access",
    dataAccess: "Data Access",
    systemAccess: "System Access"
  },
  statusChart: {
    title: "Requests by Status"
  },
  pendingActions: {
    title: "My Pending Actions",
    saraHotelbeds: "Sara Ahmadi requested Read access to Hotelbeds Catalog",
    mohammadPricing: "Mohammad Rezaei requested Write access to Atlas Pricing",
    elhamTiqets: "Elham Mohammadi requested Execute access to Tiqets API"
  },
  reviewPreview: {
    title: "Review Preview",
    description: "{{actor}} requested {{accessType}} access to {{resource}} ({{requestId}}).",
    demoOnly: "Demo only. Approve and deny actions are intentionally not wired."
  },
  insights: {
    title: "Request Insights",
    topResourceType: "Top Resource Type",
    mostActiveActor: "Most Active Actor",
    busiestDay: "Busiest Day"
  },
  lifecycle: {
    title: "Request Lifecycle",
    requested: "Requested",
    requestedDetail: "Actor submits request",
    review: "Review",
    reviewDetail: "Manager review",
    decision: "Decision",
    decisionDetail: "Approve or deny",
    applied: "Applied",
    appliedDetail: "Access updated"
  },
  activity: {
    title: "Recent Requests Activity",
    saraApproved: "Sara Ahmadi's request for Hotelbeds Catalog was approved",
    mohammadPending: "Mohammad Rezaei's request for Atlas Pricing is pending your review",
    arashDenied: "Arash Bahmani's request for RateHawk Rates was denied",
    byline: "By {{by}} · {{date}}"
  },
  actions: {
    viewDetails: "View Details",
    review: "Review"
  }
} as const;
