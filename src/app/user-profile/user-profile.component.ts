import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  user: any = [];
  FavoriteMovies: any[] = [];
  movies: any = [];

  @Input() userData = {
    Name: '',
    Password: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  };
  // a copy of the userData for smoother user experience
  formUserData = {
    Name: '',
    Password: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  };

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}
  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.fetchApiData.getUser().subscribe((result: any) => {
      this.user = result;
      this.userData.Name = this.user.Name;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = this.user.Birthday;
      this.formUserData = { ...this.userData };
      this.fetchApiData.getAllMovies().subscribe((response) => {
        this.FavoriteMovies = response.filter((movie: any) =>
          this.user.FavoriteMovies.includes(movie._id)
        );
      });
    });
  }

  updateUserInfo(): void {
    this.fetchApiData.editUser(this.formUserData).subscribe(
      (result) => {
        console.log('User update success:', result);
        localStorage.setItem('user', JSON.stringify(result));
        this.snackBar.open('User updated successfully!', 'OK', {
          duration: 2000,
        });
        this.getProfile();
      },
      (error) => {
        console.error('Error updating profile: ', error);
        this.snackBar.open(
          'An error occurred while Updating your account.',
          'OK',
          {
            duration: 2000,
          }
        );
      }
    );
  }

  deleteUserAccount(): void {
    if (confirm('Do you want to delete your account permanently?')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('User successfully deleted.', 'OK', {
          duration: 2000,
        });
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
      });
    }
  }

  deleteFavorite(id: any): void {
    console.log(id);
    this.user = this.fetchApiData.getUser();

    this.fetchApiData.deleteFavoriteMovies(id).subscribe((result) => {
      console.log(result);
      localStorage.setItem('user', JSON.stringify(result));

      this.snackBar.open('Movie has been removed from your favorites!', 'OK', {
        duration: 2000,
      });
      // Remove the movie ID from FavoriteMovies array
      this.FavoriteMovies = this.FavoriteMovies.filter(
        (movieId) => movieId !== id
      );
    });
  }
}
