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

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
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
}
