import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  /**
   * Creates an instance of NavbarComponent.
   * @param snackBar - Angular Material snackbar service, for displaying messages.
   * @param router - Angular Router service, for navigating between routes.
   */
  constructor(public snackBar: MatSnackBar, public router: Router) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {}

  /**
   * Function to navigate to the movies page.
   */
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Function to navigate to the profile page.
   */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Function to log out the user.
   * Clearing the token and user data from the local storage
   */
  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.snackBar.open('You have been logged out', 'OK', {
      duration: 2000,
    });
    this.router.navigate(['welcome']);
  }

  /**
   * If user logged out, don't show navbar
   */
  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
