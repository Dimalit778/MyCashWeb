export class AuthFunc {
  email_textbox = "login-email";
  password_textbox = "login-password";
  submit_login = "login-submit";

  enterEmail(email) {
    cy.getDataCy(this.email_textbox).type(email);
  }

  enterPassword(password) {
    cy.getDataCy(this.password_textbox).type(password);
  }

  clickLogin() {
    cy.getDataCy(this.submit_login).click();
  }
}
