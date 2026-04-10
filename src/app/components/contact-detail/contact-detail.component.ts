import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../../models/contact';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    selector: 'app-contact-detail',
    templateUrl: './contact-detail.component.html',
      styleUrl: './contact-detail.component.scss',
    standalone: true,
          imports: [
      MatCardModule,
      TranslocoModule
      ],
})
export class ContactDetailComponent {

  @Input() contact!: Contact;
  @Output() delete = new EventEmitter<Contact>();
@Output() edit = new EventEmitter<Contact>();
  onDelete() {
    this.delete.emit(this.contact);
  }
  onEdit() {
  this.edit.emit(this.contact);
}
}