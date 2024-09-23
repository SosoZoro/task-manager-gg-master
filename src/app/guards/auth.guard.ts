import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('AuthGuard: Checking if user can activate route', state.url);
        if(this.authService.isAuthenticated()){
            console.log('AuthGuard: User is authenticated');
            return true;
        } else {
            console.log('AuthGuard: User is not authenticated, redirecting to login');
            this.router.navigate(["/login"])
            return false;
        }
    }
}