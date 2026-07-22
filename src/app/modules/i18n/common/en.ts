export const commonEn = {
  actions: {
    back: "Back",
    continue: "Continue",
    cancel: "Cancel",
    submit: "Submit",
    search: "Search",
    searchPlaceholder: "Search...",
    saveChanges: "Save Changes",
    create: "Create",
    filter: "Filter",
    viewAll: "View All",
    update: "Update",
    subscribe: "Subscribe",
    submitRequest: "Submit Request",
    upgrade: "Upgrade",
    okGotIt: "Ok, got it",
    noReturn: "No, return",
    confirmDelete: "Yes, delete!",
    refresh: "Refresh",
    export: "Export",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    close: "Close"
  },
  filters: {
    all: "All",
    active: "Active",
    inactive: "Inactive",
    status: "Status",
    dateRange: "Date range",
    sortBy: "Sort By",
    filterBy: "Filter By"
  },
  columns: {
    name: "Name",
    status: "Status",
    createdAt: "Created at",
    updatedAt: "Updated at",
    actions: "Actions"
  },
  states: {
    loading: "Loading...",
    loadingDateRange: "Loading date range...",
    empty: "No data to display",
    error: "Error",
    success: "Success",
    wait: "Please wait.."
  },
  date: {
    today: "Today",
    week: "Week",
    day: "Day",
    from: "From",
    to: "To",
    until: "Until"
  },
  countdown: {
    expired: "Expired",
    daysShort: "{{days}}d",
    hoursShort: "{{hours}}h",
    minutesShort: "{{minutes}}m",
    secondsShort: "{{seconds}}s",
    daysHours: "{{days}}d {{hours}}h",
    hoursMinutes: "{{hours}}h {{minutes}}m",
    minutesSeconds: "{{minutes}}m {{seconds}}s",
    seconds: "{{seconds}} seconds",
    oneDay: "1 day",
    days: "{{days}} days",
    oneHour: "1 hour",
    hours: "{{hours}} hours",
    oneMinute: "1 minute",
    minutes: "{{minutes}} minutes",
    oneSecond: "1 second",
    separator: ", "
  },
  timeAgo: {
    aFewSeconds: "a few seconds ago",
    aMinute: "a minute ago",
    minutes: "{{minutes}} minutes ago",
    anHour: "an hour ago",
    hours: "{{hours}} hours ago",
    aDay: "a day ago",
    days: "{{days}} days ago",
    aMonth: "a month ago",
    months: "{{months}} months ago",
    aYear: "a year ago",
    years: "{{years}} years ago"
  },
  timeLater: {
    aFewSeconds: "in a few seconds",
    aMinute: "in a minute",
    minutes: "in {{minutes}} minutes",
    anHour: "in an hour",
    hours: "in {{hours}} hours",
    aDay: "in a day",
    days: "in {{days}} days",
    aMonth: "in a month",
    months: "in {{months}} months",
    aYear: "in a year",
    years: "in {{years}} years"
  },
  labels: {
    progress: "Progress",
    team: "Team",
    impactLevel: "Impact Level",
    quickTools: "Quick Tools",
    quickLinks: "Quick Links",
    admin: "Admin"
  },
  select: {
    notFound: "No items found",
    loading: "Loading...",
    typeToSearch: "Type to search",
    addTag: "Add item",
    clearAll: "Clear all"
  },
  formControls: {
    email: {
      label: "Email",
      placeholder: "Enter email"
    },
    newsletter: {
      label: "Newsletter",
      placeholder: "Your email"
    },
    phone: {
      label: "Phone",
      placeholder: "Enter your phone number"
    },
    yourPhoneNumber: {
      label: "Your phone number",
      placeholder: "Enter your phone number"
    },
    cityRecommendedHotels: {
      label: "City recommended hotels",
      placeholder: "Enter the city id"
    }
  }
} as const;
