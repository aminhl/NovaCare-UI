import {Injectable} from '@angular/core';
import Keycloak from 'keycloak-js';
import {environment} from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined;

  public get keycloak(): Keycloak {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: environment.url,
        realm: environment.realm,
        clientId: environment.clientId
      })
    }
    return this._keycloak;
  }

  public async init(): Promise<void> {
    await this.keycloak.init({ onLoad: 'login-required' });
  }

  public async login(): Promise<void> {
    return await this.keycloak.login();
  }

  public get userId(): string {
    return this.keycloak.tokenParsed?.sub as string;
  }

  public get isTokenValid(): boolean {
    return !this.keycloak.isTokenExpired();
  }

  public get fullName(): string {
    return this.keycloak.tokenParsed?.['email'] as string;
  }

  public async logout(): Promise<void> {
    return await this.keycloak.logout({ redirectUri: environment.redirectUrl });
  }

  public get accountManagement(): Promise<void> {
    return this.keycloak.accountManagement();
  }

}
