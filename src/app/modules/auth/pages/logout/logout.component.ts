import { Component, ViewEncapsulation, inject, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../data-access/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'vl-logout',
  templateUrl: './logout.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    TranslateModule,
  ]
})
export class LogoutComponent {
  private readonly authService = inject(AuthService);

  constructor() {
    this.authService.logout();
  }
}
