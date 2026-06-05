import { Builder, By, until, WebDriver } from "selenium-webdriver";
import "chromedriver";
import assert from "assert";

const titleContainsRestaurantName = async (driver: WebDriver) => {
  const title = await driver.getTitle();

  assert.equal(
    title.startsWith("MegDánelz"),
    true,
    "Az oldal címe nem tartalmazza az étterem nevét"
  );
};

const allButtonsLeadSomewhere = async (driver: WebDriver) => {
  const buttons = await driver.findElements(By.css("components-button"));
  let everyButtonLeadsSomewhere = true;
  for (const element of buttons) {
    const url = await element.getAttribute("url");
    if (url == "" || url == "#") {
      everyButtonLeadsSomewhere = false;
    }
  }
  assert.equal(
    everyButtonLeadsSomewhere,
    true,
    "Nem minden gomb vezet valahova"
  );
};

const orderGetsPosted = async (driver: WebDriver) => {
  const orderButton = await driver.findElement(By.linkText("Rendelés"));
  await orderButton.click();

  await driver.wait(
    until.elementLocated(By.css("components-productcard")),
    5000
  );

  const cartAdd = await driver.findElement(
    By.css("components-productcard components-button")
  );
  await cartAdd.click();

  const cartBtn = await driver.findElement(By.className("cart-btn"));
  await cartBtn.click();

  const ordersBeforeResponse = await driver.executeAsyncScript<string>(`
    const callback = arguments[arguments.length - 1];
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => callback(JSON.stringify(data)))
      .catch(err => callback(JSON.stringify([])));
  `);
  const ordersBefore = JSON.parse(ordersBeforeResponse);
  const ordersCountBefore = Array.isArray(ordersBefore)
    ? ordersBefore.length
    : 0;

  const finalizeButton = await driver.findElement(By.css(".finalize-button"));
  await finalizeButton.click();

  await driver.wait(until.urlContains("done"), 5000);

  await driver.get("http://localhost:5173/");

  const ordersAfterResponse = await driver.executeAsyncScript<string>(`
    const callback = arguments[arguments.length - 1];
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => callback(JSON.stringify(data)))
      .catch(err => callback(JSON.stringify([])));
  `);
  const ordersAfter = JSON.parse(ordersAfterResponse);
  const ordersCountAfter = Array.isArray(ordersAfter) ? ordersAfter.length : 0;

  assert.equal(
    ordersCountAfter > ordersCountBefore,
    true,
    "A rendelés nem került rögzítésre az API-ban"
  );
};

const orderGetsDeleted = async (driver: WebDriver) => {
  await driver.get("http://localhost:5173/orders");

  await driver.wait(until.elementLocated(By.css("components-ordercard")), 5000);

  const orderCards = await driver.findElements(By.css("components-ordercard"));
  const initialCount = orderCards.length;
  const lastOrderCard = orderCards[initialCount - 1];

  const actions = driver.actions({ async: true });
  await actions.doubleClick(lastOrderCard).perform();

  await driver.wait(async () => {
    const currentCards = await driver.findElements(
      By.css("components-ordercard")
    );
    return currentCards.length === initialCount - 1;
  }, 5000);

  const finalCards = await driver.findElements(By.css("components-ordercard"));
  assert.equal(
    finalCards.length,
    initialCount - 1,
    "A rendelést nem sikerült törölni"
  );
};

const runTest = async () => {
  const driver = await new Builder().forBrowser("chrome").build();
  const globalTests = [titleContainsRestaurantName, allButtonsLeadSomewhere];
  const testFunctions = [orderGetsPosted, orderGetsDeleted];

  try {
    for (const test of globalTests) {
      await driver.get("http://localhost:5173");
      await test(driver);
      await driver.get("http://localhost:5173/order");
      await test(driver);
      await driver.get("http://localhost:5173/orders");
      await test(driver);
      await driver.get("http://localhost:5173/cart");
      await test(driver);
      await driver.get("http://localhost:5173/legal");
      await test(driver);
      await driver.get("http://localhost:5173/done");
      await test(driver);
    }
    for (const testFunction of testFunctions) {
      await driver.get("http://localhost:5173");
      await testFunction(driver);
    }
  } finally {
    await driver.quit();
  }
};

runTest();
