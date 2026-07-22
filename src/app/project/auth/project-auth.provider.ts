import { Provider } from '@angular/core';

import { AUTH_SESSION } from '@core/auth';
import { AuthService } from '@modules/auth/data-access/auth.service';

export const PROJECT_AUTH_PROVIDER: Provider = {
  provide: AUTH_SESSION,
  useExisting: AuthService,
};
