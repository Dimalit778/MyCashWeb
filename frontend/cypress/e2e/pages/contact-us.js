describe("Contact Page", () => {
  beforeEach(() => {
    cy.loginUser();
    cy.visit("/contact");
    cy.url().should("include", "/contact");
  });
  it("should handle responsive layout correctly", () => {
    cy.testResponsiveLayout();
  });
  it("should display main sections and content", () => {
    // Header section
    cy.getDataCy("brand-logo").should("be.visible");
    cy.getDataCy("contact-title").within(() => {
      cy.get("h2").should("be.visible").and("contain", "Our support team can help you with every question you have.");
      cy.get("p").should("be.visible").and("contain", "You can contact us and our team will respond within 24 hours.");
    });

    // Contact info section
    cy.getDataCy("contact-info").within(() => {
      cy.get("h1").should("be.visible").and("contain", "Contact Us");
      cy.get("p").should("contain", "Email: Mycash@outlook.com");
      cy.get("p").should("contain", "Phone: +972 052-6731280");
    });
  });

  it("should have correct form structure and styling", () => {
    cy.getDataCy("contact-form").should("be.visible").and("have.class", "p-4").and("have.class", "border");

    // Form field validations
    const formFields = [
      {
        selector: "contact-name",
        label: "Name",
        placeholder: "Enter your name",
        type: "input",
      },
      {
        selector: "contact-email",
        label: "Email",
        placeholder: "Enter your email address",
        type: "input",
      },
      {
        selector: "contact-message",
        label: "Message",
        placeholder: "Write your message...",
        type: "textarea",
        rows: "3",
      },
    ];

    formFields.forEach((field) => {
      cy.getDataCy(field.selector).within(() => {
        cy.get("label").should("contain", field.label);
        cy.get(field.type).should("have.attr", "placeholder", field.placeholder).and("have.class", "form-control");

        if (field.rows) {
          cy.get(field.type).should("have.attr", "rows", field.rows);
        }
      });
    });

    cy.getDataCy("contact-submit-button")
      .should("be.visible")
      .and("contain", "Send")
      .and("have.class", "btn-dark")
      .and("have.css", "border-radius", "4px");
  });

  it("should show validation errors for empty fields", () => {
    cy.getDataCy("contact-submit-button").click();

    cy.contains("Name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Message is required").should("be.visible");
  });

  it("should validate email format", () => {
    // Fill other required fields
    cy.getDataCy("contact-name").find("input").type("Test User");
    cy.getDataCy("contact-message").find("textarea").type("Test message");

    // Test invalid email formats
    const invalidEmails = ["invalid", "invalid@", "invalid@test", "@test.com"];

    invalidEmails.forEach((email) => {
      cy.getDataCy("contact-email").find("input").clear();
      cy.getDataCy("contact-email").find("input").type(email);
      cy.getDataCy("contact-submit-button").click();
      cy.contains("Invalid email address").should("be.visible");
    });

    // Test valid email
    cy.getDataCy("contact-email").find("input").clear();
    cy.getDataCy("contact-email").find("input").type("test@example.com");
    cy.getDataCy("contact-submit-button").click();
    cy.contains("Invalid email address").should("not.exist");
  });

  it("should clear validation errors when typing", () => {
    // Submit empty form to trigger errors
    cy.getDataCy("contact-submit-button").click();

    // Type in fields and verify errors clear
    cy.getDataCy("contact-name").find("input").type("Test");
    cy.contains("Name is required").should("not.exist");

    cy.getDataCy("contact-email").find("input").type("test@gmail.com");
    cy.contains("Email is required").should("not.exist");

    cy.getDataCy("contact-message").find("textarea").type("Test message");
    cy.contains("Message is required").should("not.exist");
  });
  it("should handle successful form submission", () => {
    // Fill out the form
    cy.getDataCy("contact-name").find("input").type("Test User");
    cy.getDataCy("contact-email").find("input").type("test@gmail.com");
    cy.getDataCy("contact-message").find("textarea").type("This is a test message");

    // Submit form
    cy.getDataCy("contact-submit-button").click();

    // Verify success message
    cy.contains("Message sent successfully").should("be.visible");

    // Verify form reset
    cy.getDataCy("contact-name").find("input").should("have.value", "");
    cy.getDataCy("contact-email").find("input").should("have.value", "");
    cy.getDataCy("contact-message").find("textarea").should("have.value", "");
  });
});
