import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


declare var google: any;




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
    
    TranslocoModule
  ],
  
})

export class ContactComponent implements OnInit, AfterViewInit {
@ViewChild('addressInput') addressInput!: ElementRef;
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

searchResults: any[] = [];
  newContact: Contact = {
    id: "",
    name: '',
    email: '',
    phone: '',
    address:''
  };

  searchTerm: string = '';

  constructor(  private contactService: ContactService,
  private dialog: MatDialog,public auth: AuthService) {}


  ngOnInit() {
    this.loadContacts();
    this.printHello();
  }

loadContacts() {
  // Au lieu de l'observable Firestore direct, on utilise l'API REST
  this.contactService.getContactsFromRest().subscribe({
    next: (data) => {
      this.contacts = data;
      this.filteredContacts = data;
      console.log(this.contacts)
    },
    error: (err) => console.error('Erreur API REST:', err)
  });
}
  // addContact() {
  //   this.contactService.addContact(this.newContact);
  //   this.newContact = { id: "", name: '', email: '', phone: '' ,address:''};
  //   this.loadContacts();
  // }
addContact() {
  // On appelle la fonction via le service (qui appelle la Cloud Function)
  this.contactService.createContactWithCallable(this.newContact)
    .then(() => {
      console.log('Contact créé via la Cloud Function !');
      this.newContact = { id: "", name: '', email: '', phone: '', address: '' };
      this.loadContacts(); // Recharge la liste
    })
    .catch(err => console.error(err));
}
  // deleteContact(id: string) {
  //   this.contactService.deleteContact(id);
  //   this.loadContacts();
  // }
deleteContact(contact: any) {
  console.log("Contact",contact)
  // On cherche l'ID soit dans 'id', soit dans 'objectID' (pour Algolia)
  const contactId = contact.id || contact.objectID;

  console.log("ID détecté :", contactId);

  if (!contactId) {
    alert("Impossible de supprimer : ce contact n'a pas d'identifiant.");
    return;
  }

  if (confirm('Supprimer ce contact ?')) {
    this.contactService.deleteContactRest(contactId).subscribe({
      next: () => this.loadContacts(),
      error: (err) => console.error(err)
    });
  }
}
search() {
  if (!this.searchTerm.trim()) {
    this.filteredContacts = this.contacts; // Retourne à la liste complète si vide
    return;
  }

  this.contactService.searchContacts(this.searchTerm)
    .then(({ results }) => {
      // Algolia renvoie les résultats dans 'hits'
      this.filteredContacts = results[0].hits as any[];
    })
    .catch(err => {
      console.error('Erreur Algolia:', err);
    });
}


editContact(contact: Contact) {
  const dialogRef = this.dialog.open(EditContactDialogComponent, {
    width: '400px',
    data: { ...contact } // On passe une copie du contact
  });

  dialogRef.afterClosed().subscribe((result: Contact) => {
    if (result) {
      // On appelle l'API REST pour mettre à jour
      this.contactService.updateContactRest(result).subscribe({
        next: () => {
          console.log('Contact mis à jour via l\'API REST');
          this.loadContacts(); // Rafraîchir la liste
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
          alert('Erreur lors de la mise à jour.');
        }
      });
    }
  });
}
  generateRandom() {
    const contact = {
      name: randFullName(),
      email: randEmail(),
      phone: randPhoneNumber(),
      address: 'Beirut, Lebanon'
    };

    this.contactService.addContact(contact);
    this.loadContacts(); 
  }
  ngAfterViewInit() {
  const autocomplete = new google.maps.places.Autocomplete(
    this.addressInput.nativeElement
  );

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    this.newContact.address = place.formatted_address;
  });
}
  exportToPDF() {
    const docDefinition = {
      content: [
        { text: 'Contact List', style: 'header' },
        ...this.contacts.map(c => ({
          text: `${c.name} - ${c.email} - ${c.phone} - ${c.address}`,
           margin: [0, 0, 0, 5]
        }))
      ]
    };

    (pdfMake as any).vfs = (pdfFonts as any).vfs;

    (pdfMake as any).createPdf(docDefinition).download('contacts.pdf');
  }

printHello() {
  this.contactService.callHelloWorld()
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(err);
    });
}

}
