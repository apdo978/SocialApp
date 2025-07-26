import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-custom-snackbar-component',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './custom-snackbar-component.html',
  styleUrl: './custom-snackbar-component.css'
})
export class CustomSnackbarComponent {
  constructor(private snackBar: MatSnackBar){}

    dismiss() {
    this.snackBar.dismiss();
  }
}
