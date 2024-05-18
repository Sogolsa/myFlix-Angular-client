import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  constructor(public snackBar: MatSnackBar, public router: Router) {}

  ngOnInit(): void {}

  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  // Clearing the token and user data from the local storage
  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.snackBar.open('You have been logged out', 'OK', {
      duration: 2000,
    });
    this.router.navigate(['welcome']);
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
