import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak :Keycloak  | undefined;
  token: any;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 'gestion-competence',
        clientId: 'admin'
      });
    }
    return this._keycloak;
  }

  private _profile: UserProfile | undefined;

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  constructor() { }

  async init() {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
    });

    if (authenticated) {
      this.token = this.keycloak.token || ''; 
      this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak.token || '';
      console.log('token:'+this._profile.token);
    }

    }

    login() {
      return this.keycloak.login();
    }
  
    logout() {
      // this.keycloak.accountManagement();
      return this.keycloak.logout({redirectUri: 'http://localhost:4200'});
    }





}
