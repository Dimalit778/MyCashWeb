const apiUsers = `${Cypress.env("API_URL")}/api/users`;

describe("User API", () => {
  beforeEach(() => {
    cy.task("db:clear-db");
    cy.task("db:seed-user");
    cy.loginTestUser();
  });

  describe("GET /user", () => {
    it("successfully gets user info when authenticated", () => {
      cy.request("GET", `${apiUsers}/get`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property("user");
        expect(response.body.data.user).to.have.property("email");
      });
    });
    it("fails to get user when not authenticated", () => {
      cy.clearCookies();
      cy.request({
        method: "GET",
        url: `${apiUsers}/get`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property("message", "Unauthorized: No tokens available");
      });
    });
  });

  describe("PATCH /user", () => {
    it("should update user profile", () => {
      cy.request({
        method: "PATCH",
        url: `${apiUsers}/update`,
        body: {
          firstName: "Updated",
          lastName: "Name",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.user.firstName).to.eq("Updated");
        expect(response.body.data.user.lastName).to.eq("Name");
      });
    });

    it("should fail to update user with invalid data", () => {
      cy.request({
        method: "PATCH",
        url: `${apiUsers}/update`,
        body: {
          firstName: "",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("message", "First name cannot be empty");
      });
    });
    it("fail when not authenticated , no token", () => {
      cy.clearCookies();
      cy.request({
        method: "GET",
        url: `${apiUsers}/update`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property("message", "Unauthorized: No tokens available");
      });
    });
  });

  describe("DELETE /user", () => {
    it("should delete user account", () => {
      cy.request({
        method: "DELETE",
        url: `${apiUsers}/delete`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("message", "All user data has been deleted successfully");
      });
    });
    it("fail when not authenticated , no token", () => {
      cy.clearCookies();
      cy.request({
        method: "GET",
        url: `${apiUsers}/delete`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property("message", "Unauthorized: No tokens available");
      });
    });
  });
});
