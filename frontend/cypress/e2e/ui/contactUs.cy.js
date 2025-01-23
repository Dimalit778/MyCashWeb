describe("Contact Form", () => {
  beforeEach(() => {
    cy.loginUser();

    cy.visit("/contact");
  });
  it("should handle responsive layout correctly", () => {
    cy.testResponsiveLayout();
  });
  it("should display elements correctly", () => {
    cy.getDataCy("brand-logo").should("be.visible");

    // Test header content
    cy.getDataCy("contact-title").within(() => {
      cy.get("h2").should("be.visible").and("contain", "Our support team can help you with every question you have.");
      cy.get("p").should("be.visible").and("contain", "You can contact us and our team will respond within 24 hours.");
    });
    // Test contact info
    cy.getDataCy("contact-info").within(() => {
      cy.get("h1").should("be.visible").and("contain", "Contact Us");
      cy.get("p").should("be.visible").and("contain", "Email: Mycash@outlook.com");
      cy.get("p").should("be.visible").and("contain", "Phone: +972 052-6731280");
    });
    // Test contact form
    cy.getDataCy("contact-form").within(() => {
      cy.getDataCy("contact-name").should("be.visible");
      cy.getDataCy("contact-email").should("be.visible");
      cy.getDataCy("contact-message").should("be.visible");
      cy.getDataCy("contact-submit-button").should("be.visible");
    });
  });

  it("should display Form elements correctly", () => {
    // Test form container

    cy.getDataCy("contact-form").should("be.visible").and("have.class", "p-4").and("have.class", "border");

    // Test Name input field
    cy.getDataCy("contact-name")
      .should("be.visible")
      .within(() => {
        cy.get("label").should("contain", "Name");
        cy.get("input").should("have.attr", "placeholder", "Enter your name").and("have.class", "form-control");
      });

    // Test Email input field
    cy.getDataCy("contact-email")
      .should("be.visible")
      .within(() => {
        cy.get("label").should("contain", "Email");
        cy.get("input")
          .should("have.attr", "placeholder", "Enter your email address")
          .and("have.class", "form-control");
      });

    // Test Message textarea
    cy.getDataCy("contact-message")
      .should("be.visible")
      .within(() => {
        cy.get("label").should("contain", "Message");
        cy.get("textarea")
          .should("have.attr", "placeholder", "Write your message...")
          .and("have.attr", "rows", "3")
          .and("have.class", "form-control");
      });

    // Test Submit button
    cy.getDataCy("contact-submit-button")
      .should("be.visible")
      .and("contain", "Send")
      .and("have.class", "btn-dark")
      .and("have.css", "border-radius", "4px");
  });
  it("should show validation errors for empty required fields", () => {
    // Try to submit empty form
    cy.getDataCy("contact-submit-button").click();

    // Check if validation messages appear
    cy.contains("Name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Message is required").should("be.visible");

    // Fill form with valid data
    cy.getDataCy("contact-name").type("John Doe");

    cy.getDataCy("contact-submit-button").click();
    cy.contains("Name is required").should("not.exist");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Message is required").should("be.visible");

    cy.getDataCy("contact-email").type("R2E5F@example.com");

    cy.getDataCy("contact-submit-button").click();
    cy.contains("Name is required").should("not.exist");
    cy.contains("Email is required").should("not.exist");
    cy.contains("Message is required").should("be.visible");

    cy.getDataCy("contact-message").type("Test message");

    cy.getDataCy("contact-submit-button").click();
    cy.contains("Name is required").should("not.exist");
    cy.contains("Email is required").should("not.exist");
    cy.contains("Message is required").should("not.exist");
  });
  it("should Successfully send message", () => {
    // Fill form with invalid email
    cy.getDataCy("contact-name").type("John Doe");
    cy.getDataCy("contact-email").type("john.doe@gmail.com");
    cy.getDataCy("contact-message").type("Test message");

    // Submit form and check for email validation error
    cy.getDataCy("contact-submit-button").click();

    // Check success toast
    cy.contains("Message sent successfully").should("be.visible");
    // Check if form is reset
    cy.getDataCy("contact-name").should("have.value", "");
    cy.getDataCy("contact-email").should("have.value", "");
    cy.getDataCy("contact-message").should("have.value", "");
  });
});
