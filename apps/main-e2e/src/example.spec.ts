import { test, expect } from '@playwright/test';

test.describe('E-Commerce Platform', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display product catalog', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Product Catalog');

    // Check that products are displayed
    const productCards = page.locator('.card');
    await expect(productCards).toHaveCount(6); // We have 6 mock products

    // Check first product details
    const firstProduct = productCards.first();
    await expect(firstProduct.locator('h3')).toContainText('Wireless Headphones');
    await expect(firstProduct.locator('.text-2xl')).toContainText('$299.99');
  });

  test('should filter products by search', async ({ page }) => {
    // Type in search box
    await page.fill('input[placeholder="Search products..."]', 'headphones');

    // Wait for filtering
    await page.waitForTimeout(300);

    // Check filtered results
    const productCards = page.locator('.card');
    await expect(productCards).toHaveCount(1);
    await expect(productCards.first().locator('h3')).toContainText('Wireless Headphones');
  });

  test('should add product to cart and update counter', async ({ page }) => {
    // Initial cart should be empty (no counter badge)
    const cartBadge = page.locator('nav a[href="/cart"] span.absolute');
    await expect(cartBadge).not.toBeVisible();

    // Click "Add to Cart" on first product
    await page.locator('.card button').first().click();

    // Cart counter should appear with "1"
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toContainText('1');

    // Add another product
    await page.locator('.card button').nth(1).click();

    // Cart counter should show "2"
    await expect(cartBadge).toContainText('2');
  });

  test('should navigate to cart micro-frontend', async ({ page }) => {
    // Add a product to cart first
    await page.locator('.card button').first().click();

    // Click cart link in navigation
    await page.click('nav a[href="/cart"]');

    // Wait for navigation
    await page.waitForURL('**/cart');

    // Check we're on cart page
    await expect(page.locator('h1')).toContainText('Shopping Cart');

    // Check product is in cart
    await expect(page.locator('.card')).toHaveCount(1);
    await expect(page.locator('.card h3')).toContainText('Wireless Headphones');
  });

  test('should manage cart quantities', async ({ page }) => {
    // Add product to cart
    await page.locator('.card button').first().click();

    // Navigate to cart
    await page.click('nav a[href="/cart"]');
    await page.waitForURL('**/cart');

    // Initial quantity should be 1
    await expect(page.locator('.card span.font-semibold').first()).toContainText('1');

    // Click increase button
    await page.locator('button.bg-primary-500').first().click();

    // Quantity should be 2
    await expect(page.locator('.card span.font-semibold').first()).toContainText('2');

    // Total should update (299.99 * 2 = 599.98)
    await expect(page.locator('text=/\\$599\\.98/')).toBeVisible();

    // Click decrease button
    await page.locator('button.bg-gray-200').first().click();

    // Quantity should be back to 1
    await expect(page.locator('.card span.font-semibold').first()).toContainText('1');
  });

  test('should remove item from cart', async ({ page }) => {
    // Add product to cart
    await page.locator('.card button').first().click();

    // Navigate to cart
    await page.click('nav a[href="/cart"]');
    await page.waitForURL('**/cart');

    // Click remove button
    await page.click('text=Remove');

    // Cart should be empty
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    await expect(page.locator('text=Browse Products')).toBeVisible();
  });

  test('should navigate to profile micro-frontend', async ({ page }) => {
    // Click profile link
    await page.click('nav a[href="/profile"]');

    // Wait for navigation
    await page.waitForURL('**/profile');

    // Check we're on profile page
    await expect(page.locator('h1')).toContainText('My Profile');
  });

  test('should login and display user info', async ({ page }) => {
    // Navigate to profile
    await page.click('nav a[href="/profile"]');
    await page.waitForURL('**/profile');

    // Should show login prompt initially
    await expect(page.locator('text=Please log in')).toBeVisible();

    // Click login button
    await page.click('button:has-text("Login")');

    // User info should appear
    await expect(page.locator('text=Demo User')).toBeVisible();
    await expect(page.locator('text=demo@example.com')).toBeVisible();

    // Order history should be visible
    await expect(page.locator('text=Order History')).toBeVisible();
    await expect(page.locator('text=/ORD-/')).toBeVisible();
  });

  test('should maintain state across micro-frontends', async ({ page }) => {
    // Add product in main app
    await page.locator('.card button').first().click();

    // Navigate to cart MFE
    await page.click('nav a[href="/cart"]');
    await page.waitForURL('**/cart');

    // Product should be in cart (state shared!)
    await expect(page.locator('.card h3')).toContainText('Wireless Headphones');

    // Navigate back to main
    await page.click('nav a[href="/"]');
    await page.waitForURL('/');

    // Cart counter should still show 1 (state persisted!)
    const cartBadge = page.locator('nav a[href="/cart"] span.absolute');
    await expect(cartBadge).toContainText('1');
  });

  test('should handle out of stock products', async ({ page }) => {
    // Find the out of stock product (Mechanical Keyboard)
    const outOfStockProduct = page.locator('.card').filter({ hasText: 'Mechanical Keyboard' });

    // Button should be disabled
    const button = outOfStockProduct.locator('button');
    await expect(button).toBeDisabled();
    await expect(button).toContainText('Out of Stock');
  });

  test('should display cart summary correctly', async ({ page }) => {
    // Add multiple products
    await page.locator('.card button').first().click(); // $299.99
    await page.locator('.card button').nth(1).click();  // $399.99

    // Navigate to cart
    await page.click('nav a[href="/cart"]');
    await page.waitForURL('**/cart');

    // Check order summary
    await expect(page.locator('text=Items (2)')).toBeVisible();
    await expect(page.locator('text=Shipping')).toBeVisible();
    await expect(page.locator('text=Free')).toBeVisible();

    // Check total (299.99 + 399.99 = 699.98)
    await expect(page.locator('.text-xl.font-bold').filter({ hasText: '$699.98' })).toBeVisible();
  });
});
