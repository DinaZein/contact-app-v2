import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private contacts: Contact[] = [];

  constructor() {}

  getContacts(): Contact[] {
    return this.contacts;
  }

  addContact(contact: Contact) {
    contact.id = Date.now(); 
    this.contacts.push(contact);
  }

  deleteContact(id: number) {
    this.contacts = this.contacts.filter(c => c.id !== id);
  }

  updateContact(updated: Contact) {
    const index = this.contacts.findIndex(c => c.id === updated.id);
    if (index !== -1) {
      this.contacts[index] = updated;
    }
  }

  // searchContact(term: string): Contact[] {
  //   return this.contacts.filter(c =>
  //     c.name.toLowerCase().includes(term.toLowerCase()) ||
  //     c.email.toLowerCase().includes(term.toLowerCase())
  //   );
  // }
}