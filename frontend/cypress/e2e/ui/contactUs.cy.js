describe("Contact Form", () => {
  beforeEach(() => {
    cy.loginUser();

    cy.visit("/contact");
  });
  xit("should handle responsive layout correctly", () => {
    cy.testResponsiveLayout();
  });

  xit("should display all form elements correctly", () => {
    cy.contains("h1", "Contact Me").should("be.visible");
    cy.contains("h2", "Get in touch").should("be.visible");
    cy.contains("Email: Mycash@outlook.com").should("be.visible");
    cy.contains("Phone: +972 052-6731280").should("be.visible");
    cy.contains(
      "Our support team can help you with every question you have. You can contact us and our team will response you within 24 hours."
    ).should("be.visible");

    cy.getDataCy("contact-form").should("be.visible");

    cy.getDataCy("contact-name").should("be.visible");
    cy.getDataCy("contact-email").should("be.visible");
    cy.getDataCy("contact-message").should("be.visible");
    cy.getDataCy("contact-submit-button").should("be.visible");
  });

  it("should allow input in all form fields", () => {
    const testData = {
      name: "John Doe",
      email: "john@example.com",
      message: "This is a test message",
    };

    // Fill out the form
    cy.getDataCy("contact-name").type(testData.name);
    cy.getDataCy("contact-email").type(testData.email);
    cy.getDataCy("contact-message").type(testData.message);
  });

  xit("should show validation errors for empty required fields", () => {
    // Try to submit empty form
    cy.get('button[type="submit"]').click();

    // Check if browser validation is triggered for required fields
    cy.get('input[placeholder="Name.."]').invoke("prop", "validationMessage").should("not.be.empty");

    cy.get('input[placeholder="Email.."]').invoke("prop", "validationMessage").should("not.be.empty");

    cy.get('textarea[placeholder="Message..."]').invoke("prop", "validationMessage").should("not.be.empty");
  });

  xit("should validate email format", () => {
    // Try submitting with invalid email
    cy.get('input[placeholder="Name.."]').type("John Doe");
    cy.get('input[placeholder="Email.."]').type("invalid-email");
    cy.get('textarea[placeholder="Message..."]').type("Test message");
    cy.get('button[type="submit"]').click();

    // Check if email validation is triggered
    cy.get('input[type="email"]').invoke("prop", "validationMessage").should("not.be.empty");
  });

  xit("should handle form submission correctly", () => {
    // Spy on form submission
    cy.window().then((win) => {
      cy.spy(win.console, "log").as("consoleLog");
    });

    // Fill out the form
    cy.get('input[placeholder="Name.."]').type("John Doe");
    cy.get('input[placeholder="Email.."]').type("john@example.com");
    cy.get('textarea[placeholder="Message..."]').type("Test message");

    // Submit the form
    cy.get("form").submit();

    // Add assertions for what should happen after form submission
    // This will depend on your implementation of sendEmail
    // For example, if you're logging to console:
    // cy.get('@consoleLog').should('be.called');
  });

  // Optional: Test for loading states, error messages, or success messages
  // depending on your implementation

  xit("should show success message after submission", () => {
    // This test would need to be implemented based on how you handle
    // successful form submissions in your application
    cy.intercept("POST", "/api/contact", {
      // Adjust the endpoint according to your API
      statusCode: 200,
      body: { message: "Success" },
    }).as("submitForm");

    cy.get('input[placeholder="Name.."]').type("John Doe");
    cy.get('input[placeholder="Email.."]').type("john@example.com");
    cy.get('textarea[placeholder="Message..."]').type("Test message");
    cy.get("form").submit();

    cy.wait("@submitForm");
    // Add assertions for success message display
    // cy.get('.success-message').should('be.visible');
  });
});
