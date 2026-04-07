import { AfterViewInit, Component, ElementRef, Inject, NgModule, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { Contact } from '../../models/contact';
import { MatError, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

declare var google: any;
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
export class EditContactDialogComponent implements AfterViewInit {
@ViewChild('addressInput') addressInput!: ElementRef;

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
    ngAfterViewInit() {
  const autocomplete = new google.maps.places.Autocomplete(
    this.addressInput.nativeElement
  );

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    this.data.address = place.formatted_address;
  });
}
}