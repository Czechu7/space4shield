import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/_services/auth/auth.service';

@Directive({
  selector: '[isLoggedIn]',
  standalone: true,
})
export class IsLoggedInDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  constructor() {
    effect(() => {
      const isLogged = this.authService.isLogged();
      this.viewContainer.clear();
      if (isLogged) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
