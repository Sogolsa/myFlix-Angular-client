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

  /**
   * Constructor of the MovieCardComponent class.
   * @param fetchApiData - Service for fetching data from the API.
   * @param dialog - Service for opening dialogs.
   * @param snackBar - Service for displaying snack bar notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook that is called after the component's view has been initialized.
   * Initializes the component by fetching movies and Favorite movies.
   */
  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  /**
   * Fetch all the movies from the API
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Opens a dialog displaying Genre details
   * @param Name - Name of the genre
   * @param Description - Description of the genre
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '500px',
    });
  }

  /*
   * Opens a dialog displaying Director's information
   * @param Name - Name of the director
   * @param Bio - Bio of the director
   * @param Birth - Birth date of the director
   * @param Death- Death year of the director
   */
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

  /**
   * Opens a dialog displaying movie synopsis.
   * @param Title - The name of the movie.
   * @param Description - The description of the movie.
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '500px',
    });
  }

  /**
   * Retrieves user's favorite movies from local storage.
   */
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

  /**
   * Checks if a movie is user's favorite movie.
   * @param movie - The movie object.
   * @returns True if the movie is in user's favorite list, false if not.
   */
  isFav(movie: any): boolean {
    return this.FavoriteMovies.some(
      (favorite) => favorite === movie || favorite === movie._id
    );
  }

  /**
   * Toggles a movie's status in the user's favorite list.
   * @param movie - The movie' status to be toggled.
   */
  toggleFav(movie: any): void {
    if (this.isFav(movie)) {
      this.deleteFavorite(movie);
    } else {
      this.addFavorite(movie);
    }
  }

  /**
   * Adds a movie to user's favorite list.
   * @param id - The movie id to be added to the user's favorite list.
   */
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

  /**
   * Deletes a movie from the user's favorite list.
   * @param id - The movie id to be removed from user's favorite list.
   */
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
