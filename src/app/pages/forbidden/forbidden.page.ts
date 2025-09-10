import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-forbidden',
    imports: [CommonModule, RouterLink],
    templateUrl: './forbidden.page.html'
})
export default class ForbiddenPage { }
