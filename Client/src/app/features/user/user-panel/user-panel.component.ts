import { Component } from '@angular/core';
import { ISidebarItem } from '../../../shared/types/sidebar.types';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss',
})
export class UserPanelComponent {
  sidebarVisible = false;
  sidebarCollapsed = false;

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
}
