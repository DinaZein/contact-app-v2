import { Component, Inject, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { Contact } from '../../models/contact';
import { MatError, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';


@Component({
    selector: 'app-edit-contact-dialog',
    templateUrl: './edit-contact-dialog.component.html',
      styleUrl: './edit-contact-dialog.component.scss',
    standalone: true,
          imports: [
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatError,
  CommonModule,
  TranslocoModule
  ],
})
export class EditContactDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact
  ) {}

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data);
  }
}