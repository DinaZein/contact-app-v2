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
    ContactFilterPipe
  ],
})
export class ContactComponent implements OnInit {

  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  newContact: Contact = {
    id: 0,
    name: '',
    email: '',
    phone: ''
  };

  searchTerm: string = '';

  constructor(  private contactService: ContactService,
  private dialog: MatDialog) {}

  ngOnInit() {
    this.loadContacts();
  }

loadContacts() {
  this.contacts = [...this.contactService.getContacts()];
  this.filteredContacts = this.contacts;
}

  addContact() {
    this.contactService.addContact(this.newContact);
    this.newContact = { id: 0, name: '', email: '', phone: '' };
    this.loadContacts();
  }

  deleteContact(id: number) {
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

}