import {Component} from '@angular/core';
import {User} from '../model/user';
import {AuthenticationService} from '../service/authentication.service';
import {first} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  user = new User(0, '', '');
  authenticationError = '';
  loggedIn: boolean;

  resetPasswordEmail: string;

  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;

  constructor(
    private authenticationService: AuthenticationService,
    private logger: NGXLogger) {

    this.loggedIn = authenticationService.isLoggedIn();
  }

  onSubmit() {
    if (this.loggedIn) {
      return;
    }

    this.logger.log('Logging in with email = ' + this.user.email + ' ...');

    if (this.user.email === 'mstoyanovca@gmail.com' && this.user.password === 'password') {
      // register, this would normally be stored in a back end DB:
      localStorage.setItem('users', JSON.stringify([new User(1, 'mstoyanovca@gmail.com', 'password')]));
    }

    this.authenticationService.login(this.user.email, this.user.password)
      .pipe(first())
      .subscribe(
        data => {
          this.loggedIn = true;
          this.authenticationError = '';
          this.logger.log('Logged in.');
        },
        error => {
          this.logger.log('Error logging in: ' + JSON.stringify(error));
          this.authenticationError = 'Incorrect email or password';
        });
  }

  logout() {
    this.authenticationService.logout();
    this.loggedIn = false;
    this.logger.log('Logged out.');
  }

  resetPassword() {
    this.logger.log('Password reset requested for email: ' + this.resetPasswordEmail);
    document.getElementById('closeForgotPasswordModal').click();
  }

  changePassword() {
    this.logger.log('Password change requested ...');
    document.getElementById('closeChangePasswordModal').click();
  }
}