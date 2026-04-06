import { Component, OnInit } from '@angular/core';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';
import { Contact } from '../../models/contact';
import { ContactService } from '../../services/contact.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { ContactFilterPipe } from '../../pipes/contact-filter.pipe';
import { randFullName, randEmail, randPhoneNumber } from '@ngneat/falso';
import { AuthService } from '../../services/auth.service';
import { TranslocoModule } from '@ngneat/transloco';
@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
      styleUrl: './contact.component.scss',
    standalone: true,
      imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ContactDetailComponent,
    ContactFilterPipe,
    TranslocoModule
  ],
})
export class ContactComponent implements OnInit {

  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  newContact: Contact = {
    id: "",
    name: '',
    email: '',
    phone: ''
  };

  searchTerm: string = '';

  constructor(  private contactService: ContactService,
  private dialog: MatDialog,public auth: AuthService) {}

  ngOnInit() {
    this.loadContacts();
  }

loadContacts() {
  this.contactService.getContacts().subscribe(data => {
  this.contacts = data;
});
console.log(this.contacts)
  this.filteredContacts = this.contacts;
}

  addContact() {
    this.contactService.addContact(this.newContact);
    this.newContact = { id: "", name: '', email: '', phone: '' };
    this.loadContacts();
  }

  deleteContact(id: string) {
    this.contactService.deleteContact(id);
    this.loadContacts();
  }

  // search() {
  //   if (!this.searchTerm) {
  //     this.filteredContacts = this.contacts;
  //   } else {
  //     this.filteredContacts = this.contactService.searchContact(this.searchTerm);
  //   }
  // }
  editContact(contact: Contact) {
  const dialogRef = this.dialog.open(EditContactDialogComponent, {
    width: '400px',
    data: { ...contact }
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      this.contactService.updateContact(result);
      this.loadContacts();
    }
  });
}
  generateRandom() {
    const contact = {
      name: randFullName(),
      email: randEmail(),
      phone: randPhoneNumber()
    };

    this.contactService.addContact(contact);
    this.loadContacts(); 
  }
}
