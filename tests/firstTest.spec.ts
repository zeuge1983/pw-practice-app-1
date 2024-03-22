import {expect, test} from '@playwright/test'

test.beforeEach(async({page}) => {
  await page.goto('http://localhost:4200/')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
})

test('Locatore syntax rools', async({page}) => {
  // by tag name
  page.locator('input')

  // by id
  await page.locator('#inputEmail1').click();

  // by class
  page.locator('.custom-checkbox')

  // by attribute
  await expect(page.locator('[placeholder="Email"][type="email"]#inputEmail1')).toBeVisible();

  // by entire class value
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition]')

  // combine different selectors e.g tag + attributes (no space)
  await expect(page.locator('input[placeholder="Jane Doe"][nbinput]')).toBeVisible();

  // xpath (not recommended)
  page.locator('//*[@id="inputEmail1"]')

  // by partial text match
  await expect(page.locator(':text("Using")')).toBeVisible();

  // by exact text match
 await expect( page.locator(':text-is("Using the Grid")')).toBeVisible();
})

test('User facing locators', async({page}) => {
  await page.locator('#inputEmail1').click();
  await page.getByTestId('SignIn').click();

  await page.getByPlaceholder('Jane Doe').click()
  await page.getByText('Form without labels').click()
  await page.getByTestId('SignIn').click()
  await page.getByRole('link', { name: 'IoT Dashboard' }).click();
})

// finding child elements
test('Locating child elements', async({page}) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click()

  // alternative way
  await page.locator('nb-card').locator('nb-card-body').locator('nb-radio').locator(':text-is("Option 2")').click()

  // locating with combining the locator and role
  await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

  // index for the elements
  await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locationg parent elements',async ({page}) => {
  // nb-card is the parent
  // by text
  await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()

  // by id
  await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

  // by filter
  await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
  await page.locator('nb-card').filter({has: page.locator('#exampleInputEmail1')}).getByRole('textbox', {name: "Email"}).click()
  await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

  // chaining filters
  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
        .getByRole('textbox', {name: "Email"}).click()

  await page.locator(':text-is("Using the Grid")').locator("..").getByRole('textbox', {name: "Email"}).click()
})

test('Reusing locators', async ({page}) => {

  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
  const emailField = basicForm.getByRole('textbox', {name: "Email"})
  const passwordField = basicForm.getByRole('textbox', {name: "Password"})

  await emailField.fill("email@test.com")
  await passwordField.fill("password")
  await basicForm.locator('nb-checkbox').click()
  await basicForm.filter({hasText: "Basic form"}).getByRole('button').click()

  await expect(emailField).toHaveValue('email@test.com')
  expect(basicForm.locator('nb-checkbox')).toBeTruthy()
})

test('Extracting values', async ({page}) => {
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
  const buttonText = await basicForm.locator('button').textContent()

  expect(buttonText).toEqual('Submit')

  // all text values
  const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
  expect(allRadioButtonsLabels).toContain("Option 1")

  // the value of the input fields
  const emailField = basicForm.getByRole('textbox', {name: "Email"})
  await emailField.fill('email@test.com')
  const emailValue = await emailField.inputValue()
  expect(emailValue).toEqual('email@test.com')

  // the value of the attribute
  const placeHolderValue = await emailField.getAttribute('placeholder')
  expect(placeHolderValue).toEqual('Email')
})

test('Assertions',async ({page}) => {
  // General asserions, general asserions will not wait for any conditions
  // const value = 5
  // expect(value).toEqual(5)

  const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
  const buttonText = await basicFormButton.textContent()
  expect(buttonText).toEqual("Submit")

  // Locator asserions, locator asserions will wait for 5 seconds by default
  await expect(basicFormButton).toHaveText('Submit')

  // Soft assertions - test can continue when assertion failed
  await expect.soft(basicFormButton).toHaveText('Submit123')
  await basicFormButton.click() // - test will click on th ebutton despite assertion failed
})

test('Auto waiting',async ({page}) => {
  // https://playwright.dev/docs/actionability

  
})
