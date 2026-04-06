import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user
} from '@angular/fire/auth';
import { updateProfile } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

async register(email: string, password: string, name: string) {
  const result = await createUserWithEmailAndPassword(this.auth, email, password);

  
  await updateProfile(result.user, {
    displayName: name
  });

  return result;
}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

}3