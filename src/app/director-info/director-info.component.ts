import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrl: './director-info.component.scss',
})
export class DirectorInfoComponent {
  /**
   *
   * @param dialogRef - Angular Material dialog reference.
   * @param data - Data injected to the dialog containing director information
   * @property Name - The name of the director
   * @property Bio - Director's bio
   * @property Birth - Director's Birth date
   * @property Death - Director's Death year
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Bio: string;
      Birth: Date;
      Death: Date;
    }
  ) {}
}
