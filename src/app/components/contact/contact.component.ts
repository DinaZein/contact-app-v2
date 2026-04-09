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
import algoliasearch from 'algoliasearch'; 

declare var google: any;

const client = algoliasearch('UUU2L6S742', '042af01efbd748bfb53aa0a18341ef5d');
const index = client.initIndex('contacts');


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
  }

loadContacts() {
  this.contactService.getContacts().subscribe(data => {
  this.contacts = data;
   
        this.pushToAlgolia(this.contacts);
   
});
console.log(this.contacts)
  this.filteredContacts = this.contacts;
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
// search() {
//   const index = client.initIndex('contacts');

//   index.search(this.searchTerm).then((res: any) => {
//     this.searchResults = res.hits;
//   });
// }
pushToAlgolia(contacts: Contact[]) {
  index.saveObjects(
    contacts.map(c => ({
      objectID: c.id,
      ...c
    }))
  );
}
searchAlgolia(query: string) {
  index.search<Contact>(query).then(response => {
   
    this.searchResults = response.hits.map(hit => ({
      id: hit.objectID, 
      name: hit.name,
      email: hit.email,
      phone: hit.phone,
      address: (hit as any).address || ''
    }));
  });
}

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;

    if (!this.searchTerm.trim()) {
      this.filteredContacts = this.contacts;
      this.searchResults = [];
    } else {
     
      this.searchAlgolia(this.searchTerm);
    
    }
  }


}
