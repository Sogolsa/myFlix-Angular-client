import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  // Declaring the movie variable as an array, where we keep the movies returned from API call
  movies: any[] = [];
  user: any = {};
  userData = { Name: '', FavoriteMovies: [] };
  FavoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  // Opens a dialog displaying Genre details
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '500px',
    });
  }

  // Opens a dialog displaying Director's information
  openDirectorDialog(
    name: string,
    bio: string,
    birth: Date,
    death: Date
  ): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
        Death: death,
      },
      width: '500px',
    });
  }

  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '500px',
    });
  }

  getFavorites(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.FavoriteMovies = this.user.FavoriteMovies;
      console.log('getFavorites: ', this.FavoriteMovies);
    });
  }

  // if it's movie._id it doesn't show right away, if it's movie, it doesn't show when refreshed
  // isFav(movie: any): boolean {
  //   return this.FavoriteMovies.includes(movie);
  // }
  isFav(movie: any): boolean {
    return this.FavoriteMovies.some(
      (favorite) => favorite === movie || favorite === movie._id
    );
  }

  toggleFav(movie: any): void {
    if (this.isFav(movie)) {
      this.deleteFavorite(movie);
    } else {
      this.addFavorite(movie);
    }
  }

  addFavorite(id: string): void {
    console.log('Adding favorite movie:', id);

    this.fetchApiData.addFavoriteMovies(id).subscribe(
      (response) => {
        console.log('Response after adding favorite movie:', response);
        if (response) {
          localStorage.setItem('user', JSON.stringify(response));
          this.user = response;
          this.FavoriteMovies.push(id);
          this.snackBar.open('Movie has been added to your favorites!', 'OK', {
            duration: 3000,
          });
        }
      },
      (error) => {
        console.error('Error during subscription:', error);
      }
    );
  }

  deleteFavorite(id: any): void {
    console.log(id);
    this.user = this.fetchApiData.getUser();
    this.fetchApiData.deleteFavoriteMovies(id).subscribe((result) => {
      console.log('movie removed: ', result);
      localStorage.setItem('user', JSON.stringify(result));
      this.snackBar.open('Movie has been removed from your favorites!', 'OK', {
        duration: 2000,
      });

      // Remove the movie ID from FavoriteMovies array
      this.FavoriteMovies = this.FavoriteMovies.filter(
        (movieId) => movieId !== id
      );

      // Update the isFavorite property of the corresponding movie object to false
      const removedMovieIndex = this.movies.findIndex(
        (movie) => movie._id === id
      );
      if (removedMovieIndex !== -1) {
        this.movies[removedMovieIndex].isFavorite = false;
      }
      this.getFavorites(); // to update the favorite button to unfavorite right away
    });
  }
}
