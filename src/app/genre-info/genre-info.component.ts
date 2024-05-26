import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss'],
})
export class GenreInfoComponent {
  /**
   * Constructor for the GenreInfoComponent.
   * @param dialogRef - Angular Material dialog reference to the dialog opened by GenreInfoComponent
   * @param data -  Data injected to the dialog containing director information
   * @property Name - The name of the genre.
   * @property Description - The description of the genre.
   */

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Description: string;
    }
  ) {}
}
