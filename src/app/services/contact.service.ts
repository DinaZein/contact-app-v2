// import { Injectable } from '@angular/core';
// import { Contact } from '../models/contact';

// @Injectable({
//   providedIn: 'root'
// })
// export class ContactService {

//   private contacts: Contact[] = [];

//   constructor() {}

//   getContacts(): Contact[] {
//     return this.contacts;
//   }

//   addContact(contact: Contact) {
//     contact.id = Date.now(); 
//     this.contacts.push(contact);
//   }

//   deleteContact(id: number) {
//     this.contacts = this.contacts.filter(c => c.id !== id);
//   }

//   updateContact(updated: Contact) {
//     const index = this.contacts.findIndex(c => c.id === updated.id);
//     if (index !== -1) {
//       this.contacts[index] = updated;
//     }
//   }

//   // searchContact(term: string): Contact[] {
//   //   return this.contacts.filter(c =>
//   //     c.name.toLowerCase().includes(term.toLowerCase()) ||
//   //     c.email.toLowerCase().includes(term.toLowerCase())
//   //   );
//   // }
// }


import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact';

@Injectable({ providedIn: 'root' })
export class ContactService {

  private contactsRef;

  constructor(private firestore: Firestore) {
    this.contactsRef = collection(this.firestore, 'contacts');
  }

  getContacts(): Observable<Contact[]> {
    return collectionData(this.contactsRef, { idField: 'id' }) as Observable<Contact[]>;
  }

  addContact(contact: Omit<Contact, 'id'>) {
    return addDoc(this.contactsRef, contact);
  }

  updateContact(contact: Contact) {
    const docRef = doc(this.firestore, `contacts/${contact.id}`);
    return updateDoc(docRef, { ...contact });
  }

  deleteContact(id: string) {
    const docRef = doc(this.firestore, `contacts/${id}`);
    return deleteDoc(docRef);
  }
}