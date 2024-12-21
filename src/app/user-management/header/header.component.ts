import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  useruserDetailObject: any | undefined;
  isRole: string = '';

  ngOnInit(): void {
    const userDetails = localStorage.getItem('userDetails');
    this.useruserDetailObject = JSON.parse(userDetails!);
    if (this.useruserDetailObject) {
      this.isRole = this.useruserDetailObject.role
    }
  }

  constructor(private readonly router: Router) { }

  logout() {
    const confirmation = window.confirm('Are you sure you want to logout?');
    if (confirmation) {
      this.router.navigate(['']);
      localStorage.removeItem('userDetails')
    }
  }
}
