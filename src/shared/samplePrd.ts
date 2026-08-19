export const SAUCE_DEMO_PRD_TEXT = `# Product Requirements Document (PRD): Swag Labs (SauceDemo E-Commerce)
**Version:** 2.4.0  
**Target Environment:** https://www.saucedemo.com/  
**Owner:** QA & Core Engineering Team  
**Status:** Approved for Test Automation  

---

## 1. Executive Summary
Swag Labs is a premier reference e-commerce single-page application built to evaluate cross-browser reliability, end-to-end shopping journeys, checkout friction, and security controls. The application allows verified customers to browse items, sort inventory by price/name, manage cart state, enter shipping details, and complete multi-step order checkout with dynamic tax and subtotal computation.

---

## 2. Core User Personas
- **Standard Shopper (\`standard_user\`):** Valid user who expects full browsing, ordering, and cart functionality.
- **Locked-Out User (\`locked_out_user\`):** User whose account is disabled; must see clear authentication denial.
- **Problematic User (\`problem_user\`):** Encounters broken product images and cart desynchronization.
- **Performance Glitch User (\`performance_glitch_user\`):** Experiences API latency; system must gracefully handle delayed responses.
- **Error User (\`error_user\`):** Triggers unexpected checkout errors; requires resilience testing.
- **Visual User (\`visual_user\`):** Has layout anomalies; requires visual regression coverage.

---

## 3. Functional Requirements

### REQ-001: User Authentication & Access Control
- **User Story:** As an e-commerce customer, I want to authenticate using my credentials so that my session is established securely.
- **Acceptance Criteria:**
  1. Submitting valid credentials (\`standard_user\` / \`secret_sauce\`) must navigate to \`/inventory.html\` within 2 seconds.
  2. Submitting empty username or password must display inline error: "Epic sadface: Username is required" or "Epic sadface: Password is required".
  3. Submitting invalid credentials must display: "Epic sadface: Username and password do not match any user in this service".
  4. Submitting credentials for \`locked_out_user\` must display: "Epic sadface: Sorry, this user has been locked out.".
  5. Clicking the "X" error dismiss icon must clear the error banner.
  6. Navigating directly to \`/inventory.html\` without an active auth cookie/session must redirect back to login with an error message.

### REQ-002: Product Catalog, Filtering & Sorting
- **User Story:** As a customer, I want to browse products and sort them by price and name so that I can quickly find items I want to purchase.
- **Acceptance Criteria:**
  1. Inventory page must render 6 standard catalog items with image, title, description, and price.
  2. Sorting by "Name (A to Z)" must order products alphabetically ascending.
  3. Sorting by "Name (Z to A)" must order products alphabetically descending.
  4. Sorting by "Price (low to high)" must sort numeric item prices ascending.
  5. Sorting by "Price (high to low)" must sort numeric item prices descending.
  6. Clicking any item title or image must navigate to the specific item details view (\`/inventory-item.html?id=...\`).

### REQ-003: Shopping Cart Management
- **User Story:** As a customer, I want to add items to my cart, inspect the cart badge count, and remove items before checkout.
- **Acceptance Criteria:**
  1. Clicking "Add to cart" on any product must increment the cart badge count and toggle button state to "Remove".
  2. Clicking "Remove" must decrement the cart badge count and revert button state to "Add to cart".
  3. Cart state must persist when navigating between inventory view and item detail view.
  4. Navigating to \`/cart.html\` must display all selected items with correct quantities, individual item prices, and descriptions.
  5. Removing an item directly inside \`/cart.html\` must immediately update the list and header badge without page reload.
  6. Clicking "Continue Shopping" must return the user to \`/inventory.html\` preserving remaining cart selections.

### REQ-004: Multi-Step Checkout & Calculation
- **User Story:** As a customer, I want to provide shipping information, review order pricing breakdown with tax, and complete payment.
- **Acceptance Criteria:**
  1. Clicking "Checkout" on empty or populated cart navigates to \`/checkout-step-one.html\`.
  2. Submitting checkout step one with missing First Name, Last Name, or Postal Code must show validation error.
  3. Valid postal code formats (alphanumeric 5-10 chars) must be accepted.
  4. Submitting valid information navigates to \`/checkout-step-two.html\` (Overview).
  5. Overview page must show Payment Information (e.g., "SauceCard #31337"), Shipping Information (e.g., "Free Pony Express Delivery!"), Item total, 8% Tax, and Total sum.
  6. Total price must strictly equal: \`Item total + Math.round(Item total * 0.08 * 100) / 100\`.
  7. Clicking "Finish" navigates to \`/checkout-complete.html\` with header "Thank you for your order!".
  8. Clicking "Back Home" clears the cart and returns user to inventory.

### REQ-005: Navigation, Sidebar Menu & Logout
- **User Story:** As a user, I want a persistent sliding menu to access app links, reset state, and safely logout.
- **Acceptance Criteria:**
  1. Clicking hamburger icon opens left sidebar drawer with 4 links: "All Items", "About", "Logout", "Reset App State".
  2. "About" link must direct to https://saucelabs.com/.
  3. "Reset App State" must clear cart items across active session.
  4. "Logout" must terminate session, clear storage, and redirect to \`/\`.
  5. Clicking "X" or pressing Escape must close the sidebar.

### REQ-006: Responsive Layout & Accessibility
- **User Story:** As an inclusive platform, the interface must comply with WCAG 2.1 AA standards and support mobile viewports.
- **Acceptance Criteria:**
  1. All interactive buttons and inputs must have valid \`data-test\` or \`id\` attributes.
  2. Form inputs must support keyboard Tab navigation and submit on Enter keypress.
  3. Contrast ratio of text elements must meet 4.5:1 minimum threshold.
`;
