import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(@Inject(PLATFORM_ID) private platformId: any){}
    
    setToken(token: string, loggedUser: any){
        console.log('Setting token and user ID');
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("authId", loggedUser.uid);
    }

    getToken(): string | null {
        const token = sessionStorage.getItem("authToken");
        console.log('Retrieved token:', token);
        return token;
      }

    getId(): string | null{
        const id = sessionStorage.getItem("authId");
        console.log('Retrieved user ID:', id);
        return id;
    }

    logout() {
        console.log('Logging out user');
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("authId");
    }

    isAuthenticated(): boolean{
        if(isPlatformBrowser(this.platformId)){
            const isAuth = !!this.getToken();
            console.log('Is authenticated:', isAuth);
            return isAuth;
        }
        console.log('Not in browser environment');
        return false;
    }
}