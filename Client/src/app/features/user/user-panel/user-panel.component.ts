import { Component } from '@angular/core';
import { ISidebarItem } from '../../../shared/types/sidebar.types';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { RouterOutlet, RouterLink, Router, Event, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, RouterLink, NgIf],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss',
})
export class UserPanelComponent {
  sidebarVisible = false;
  sidebarCollapsed = false;
  showTiles = true;

  menuItems: ISidebarItem[] = [
    {
      label: 'Sensors',
      icon: 'pi pi-list',
      routerLink: '/user/sensors',
    },
    {
      label: 'Sensors',
      icon: 'pi pi-chart-bar',
      routerLink: '/user/sensors',
    },
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showTiles = event.urlAfterRedirects === '/user';
      }
    });
  }
}
