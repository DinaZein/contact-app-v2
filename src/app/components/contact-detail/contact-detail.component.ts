import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../../models/contact';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-contact-detail',
    templateUrl: './contact-detail.component.html',
      styleUrl: './contact-detail.component.scss',
    standalone: true,
          imports: [
      MatCardModule
      
      ],
})
export class ContactDetailComponent {

  @Input() contact!: Contact;
  @Output() delete = new EventEmitter<string>();
@Output() edit = new EventEmitter<Contact>();
  onDelete() {
    this.delete.emit(this.contact.id);
  }
  onEdit() {
  this.edit.emit(this.contact);
}
}