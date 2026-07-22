export const membershipDirectoryWorkspaceEn = {
  title: "Membership Directory",
  description: "Review workspace memberships, invitations, roles, organizations, and recent access activity.",
  summary: {
    totalMembers: "Total Members",
    totalMembersDetail: "+12 this month",
    activeMembers: "Active Members",
    activeMembersDetail: "85% of total",
    pendingInvitations: "Pending Invitations",
    pendingInvitationsDetail: "6% of total",
    inactiveSuspended: "Inactive / Suspended",
    inactiveSuspendedDetail: "9% of total",
    organizations: "Organizations",
    organizationsDetail: "Across all workspaces",
    roles: "Roles",
    rolesDetail: "Professionally labeled"
  },
  filters: {
    searchLabel: "Search",
    searchPlaceholder: "Search members, organizations, or email...",
    organization: "Organization",
    activeOrganization: "Active Organization",
    allOrganizations: "All Organizations",
    role: "Role",
    allRoles: "All Roles",
    status: "Status",
    allStatuses: "All Statuses",
    workspace: "Workspace",
    allWorkspaces: "All Workspaces",
    moreFilters: "More Filters",
    export: "Export"
  },
  table: {
    title: "All Memberships ({{count}})",
    actor: "Actor",
    organization: "Organization",
    role: "Role",
    workspace: "Workspace",
    status: "Status",
    source: "Source",
    effectiveSince: "Effective Since",
    lastActivity: "Last Activity",
    actions: "Actions",
    showing: "Showing 1 to 10 of {{count}} results",
    pageSize: "10 / page",
    pageUnit: "page"
  },
  status: {
    active: "Active",
    pending: "Pending",
    inactive: "Inactive",
    suspended: "Suspended",
    revoked: "Terminated"
  },
  states: {
    loading: "Loading memberships...",
    empty: "No memberships match the current filters.",
    error: "Membership Directory could not load memberships.",
    detailError: "Membership details could not be loaded.",
    lifecycleError: "Membership lifecycle action could not be applied.",
    selectMembership: "Select a membership to view tenant and organization context."
  },
  details: {
    title: "Membership Context",
    membershipId: "Membership ID",
    organization: "Organization",
    context: "Tenant Context",
    status: "Lifecycle Status"
  },
  lifecycle: {
    title: "Lifecycle Actions",
    activate: "Activate",
    suspend: "Suspend",
    terminate: "Terminate",
    restore: "Restore"
  },
  roles: {
    title: "Memberships by Role",
    others: "Others"
  },
  invitations: {
    title: "Recent Invitations"
  },
  activity: {
    title: "Recent Activity",
    roleUpdated: "Sara Ahmadi role updated from Sales Agent to Pricing Manager",
    invitationSent: "New invitation sent to Sina Moradi for role Pricing Manager",
    supplierReportsGranted: "Hossein Karimi granted access to Supplier Financial Reports",
    membershipAdded: "Negar Akbari added to workspace Atlas Travel Agency",
    localTimezone: "All times are shown in your local timezone."
  },
  actions: {
    viewAllRoles: "View All Roles"
  }
} as const;
