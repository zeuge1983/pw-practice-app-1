import {expect, test} from '@playwright/test'

test.beforeEach(async({page}) => {
  await page.goto('http://uitestingplayground.com/ajax')
  await page.getByText('Button Triggering AJAX Request').click()
})

test('Auto waiting', async ({page}) => {
  const successButton = page.locator('.bg-success')

  // await successButton.click()
  // const text =  await successButton.textContent() // textContent() has auto wait, 15 seconds by default
  // const text =  await successButton.allTextContents() //this will fail by default because allTextContents() does not wait

  // workaround for conditions that do not have auto waiting
  await successButton.waitFor({state: "attached"})
  const text =  await successButton.allTextContents()

  expect(text).toContain('Data loaded with AJAX get request.')

  // overriding default timeout for toHaveText() function
  await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('Alternative waits',async ({page}) => {
  const successButton = page.locator('.bg-success')

  // example 1: waitForSelector()
  await page.waitForSelector('.bg-success')

  // exmaple 2: wait for particular response (network tab)
  await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

  // example 3: wait for network calls to be completed
  await page.waitForLoadState('networkidle')

  const text =  await successButton.allTextContents()
  expect(text).toContain('Data loaded with AJAX get request.')
})
