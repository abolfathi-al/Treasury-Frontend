import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, OperatorFunction } from 'rxjs';

import { IS_SERVER_PLATFORM } from '../tokens';
import { trackResource } from '@utils/async-resource';
import { BasicInfo, PlatformMetadata } from './in-memory-db';
import { NotificationService } from './notification.service';

const API_URL = 'api';
const CLIENT_DELAY_MS = 150;

@Injectable({ providedIn: 'root' })
export class BasicInformationService {
  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);
  private readonly isServer = inject(IS_SERVER_PLATFORM);

  info() {
    return this.http
      .get<BasicInfo>(`${API_URL}/basicInformation`)
      .pipe(this.withOptionalDelay(), this.track());
  }

  platformMetadata() {
    return this.http
      .get<PlatformMetadata>(`${API_URL}/platformMetadata`)
      .pipe(this.withOptionalDelay(), this.track());
  }

  private withOptionalDelay<T>(): OperatorFunction<T, T> {
    return this.isServer ? map((value: T) => value) : delay<T>(CLIENT_DELAY_MS);
  }

  private track<T>() {
    return trackResource<T>(this.notification, this.isServer);
  }
}
