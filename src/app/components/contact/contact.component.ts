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
  this.contactService.getContacts().subscribe(data => {
  this.contacts = data;
 this.filteredContacts = this.contacts;
   
});
console.log(this.contacts)
 
}

  addContact() {
    this.contactService.addContact(this.newContact);
    this.newContact = { id: "", name: '', email: '', phone: '' ,address:''};
    this.loadContacts();
  }

  deleteContact(id: string) {
    this.contactService.deleteContact(id);
    this.loadContacts();
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
