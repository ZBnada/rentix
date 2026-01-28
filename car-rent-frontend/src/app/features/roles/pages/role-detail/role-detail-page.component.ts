import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoleDetailComponent } from '../../components/role-detail/role-detail.component';

@Component({
    selector: 'app-role-detail-page',
    standalone: true,
    imports: [RoleDetailComponent],
    template: `<app-role-detail [roleId]="roleId"></app-role-detail>`
})
export class RoleDetailPageComponent implements OnInit {
    roleId: string = '';

    constructor(private readonly route: ActivatedRoute) {}

    ngOnInit(): void {
        this.roleId = this.route.snapshot.paramMap.get('id') || '';
    }
}