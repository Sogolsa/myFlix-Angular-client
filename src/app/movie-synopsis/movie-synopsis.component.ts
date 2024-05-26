import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-synopsis',
  templateUrl: './movie-synopsis.component.html',
  styleUrl: './movie-synopsis.component.scss',
})
export class MovieSynopsisComponent {
  /**
   * @param dialogRef - Angular Material dialog reference.
   * @param data - data injected to the dialog containing movie title and description
   * @property Title - Title of the movie
   * @property Description - Description of the movie
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Title: string;
      Description: string;
    }
  ) {}
}
