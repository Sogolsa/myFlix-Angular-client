import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent implements OnInit {
  /**
   * User data input for logging in
   * @property {string} Name - The user's name ore username
   * @property {string} Password - The user's password
   */
  @Input() userData = { Name: '', Password: '' };

  /**
   * Constructs the UserLoginFormComponent.
   * @param fetchApiData - The service for fetching API data.
   * @param dialogRef - Angular Material dialog reference.
   * @param snackBar - Angular Material snackbar service for showing messages.
   * @param router - Angular router service for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {}

  /**
   * Logs in the user.
   * If successful, stores user data and token in local storage, closes the dialog,
   * shows a success message, and navigates to the movies page.
   * If login fails, shows a failure message.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close(); // This will close the modal on success!
        this.snackBar.open('User logged in successfully!', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (result) => {
        this.snackBar.open('User login failed', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
