import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';

@Component({
    selector: 'app-user-detail-page',
    standalone: true,
    imports: [UserDetailComponent],
    template: `<app-user-detail [userId]="userId"></app-user-detail>`
})
export class UserDetailPageComponent implements OnInit {
    userId: string = '';

    constructor(private readonly route: ActivatedRoute) {}

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id') || '';
    }
}