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
import { Functions, httpsCallable } from '@angular/fire/functions';
import { algoliasearch } from 'algoliasearch';
import { HttpClient } from '@angular/common/http';
import { getFunctions } from 'firebase/functions';
@Injectable({ providedIn: 'root' })

export class ContactService {

  private contactsRef;

  constructor(private firestore: Firestore,private functions: Functions,private http: HttpClient) {
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
    callHelloWorld() {
    const hello = httpsCallable(this.functions, 'helloWorld');
    return hello({});
  }


searchContacts(query: string): Promise<any> {
    const client = algoliasearch('UUU2L6S742', '042af01efbd748bfb53aa0a18341ef5d');
  return client.search({
    requests: [
      {
        indexName: 'contacts',
        query: query,
      },
    ],
  });
}
private apiUrl = 'https://us-central1-contact-app-436fe.cloudfunctions.net/api/contacts';

  // Utilisation de l'API REST au lieu de Firestore directement
  getContactsRest() {
    return this.http.get<Contact[]>(this.apiUrl);
  }

getContactsFromRest() {
  return this.http.get<Contact[]>(this.apiUrl);
}

// Appel de la fonction Callable (POST serveur)
async createContactWithCallable(contact: Contact) {
  const functions = getFunctions();
  const createContact = httpsCallable(functions, 'createContactCallable');
  return createContact(contact);
}

// Optionnel: Appeler l'API REST pour supprimer (DELETE)
deleteContactRest(id: string) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
// contact.service.ts

updateContactRest(contact: Contact) {
  // On envoie les données vers : https://.../api/contacts/ID_DU_CONTACT
  // contact.id (ou contact.objectID) contient l'identifiant
  const id = contact.id || (contact as any).objectID;
  return this.http.put(`${this.apiUrl}/${id}`, contact);
}

}
