export const errorsWorkspaceEn = {
  general: {
    backButton: "Go Back",
    retryButton: "Try Again",
    homeButton: "Home",
    networkError: "Network connection error. Please check your internet connection.",
    timeoutError: "Connection timeout. Please try again.",
    tooManyRequests: "Too many requests. Please wait a moment.",
    clientError: "An error occurred in the request.",
    unknownError: "An unknown error occurred."
  },
  error404: {
    title: "Page Not Found - 404",
    message: "Sorry, the page you are looking for was not found"
  },
  error500: {
    title: "Server Error - 500",
    message: "An error occurred on the server"
  },
  error403: {
    title: "Access Denied - 403",
    message: "You do not have the necessary permissions to view this content"
  },
  error401: {
    title: "Authentication Required - 401",
    message: "You must be logged in to access this resource"
  },
  error400: {
    title: "Bad Request - 400",
    message: "Your request is invalid"
  },
  error503: {
    title: "Service Unavailable - 503",
    message: "The server is currently unable to handle the request"
  }
} as const;
