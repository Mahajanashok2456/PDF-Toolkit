describe("PDF Toolkit App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the app and display header", () => {
    cy.contains("PDF Toolkit").should("be.visible");
  });

  it("should toggle dark mode", () => {
    cy.get('button[aria-label="Switch to dark mode"]').click();
    cy.get("body").should("have.class", "dark");
    cy.get('button[aria-label="Switch to light mode"]').click();
    cy.get("body").should("not.have.class", "dark");
  });

  it("should be responsive on mobile", () => {
    cy.viewport("iphone-6");
    cy.contains("PDF Toolkit").should("be.visible");
    cy.get(".max-w-4xl").should("be.visible");
  });

  it("should select a tool and show file uploader", () => {
    cy.contains("Merge PDFs").click();
    cy.contains("Drop PDF files here or click to upload").should("be.visible");
  });
});
