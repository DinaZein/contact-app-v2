import { Component, Inject, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { Contact } from '../../models/contact';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-edit-contact-dialog',
    templateUrl: './edit-contact-dialog.component.html',
      styleUrl: './edit-contact-dialog.component.scss',
    standalone: true,
          imports: [
MatFormFieldModule,
MatDialogActions,
    FormsModule,
    MatDialogContent
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