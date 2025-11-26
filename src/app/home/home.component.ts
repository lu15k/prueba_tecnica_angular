import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, CardModule, ButtonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export default class HomeComponent { }
