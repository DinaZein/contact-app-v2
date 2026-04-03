import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '../models/contact';

@Pipe({
    name: 'contactFilter',
    standalone: true
})
export class ContactFilterPipe implements PipeTransform {

  transform(contacts: Contact[], searchTerm: string): Contact[] {
    if (!contacts || !searchTerm) return contacts;

    return contacts.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}