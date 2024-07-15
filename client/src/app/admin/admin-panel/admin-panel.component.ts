import { Component } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HasRoleDirective } from '../../direcives/has-role.directive';
import { AdminManagementComponent } from "../admin-management/admin-management.component";
import { PhotoManagementComponent } from "../photo-management/photo-management.component";

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    templateUrl: './admin-panel.component.html',
    styleUrl: './admin-panel.component.css',
    imports: [TabsModule, AdminManagementComponent, PhotoManagementComponent,HasRoleDirective]
})
export class AdminPanelComponent {

}
