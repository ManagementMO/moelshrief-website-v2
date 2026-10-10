(async (page) => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  const report = { checks: [], screenshots: [] };
  const base = new URL(page.url()).origin;
  await page.goto(base);
  await page.setViewportSize({ width: 1440, height: 1400 });
  if (!await page.locator("html").evaluate(el => el.classList.contains("dark"))) {
    await page.getByRole("button", { name: "Theme: light — click to toggle" }).click();
  }
  await page.waitForFunction(() => getComputedStyle(document.querySelector(".company-link")).color === "rgb(251, 191, 36)");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "output/playwright/after-desktop-dark.png", fullPage: true });
  report.screenshots.push("after-desktop-dark.png");
  check(await page.locator(".company-link").first().evaluate(el => getComputedStyle(el).color) === "rgb(251, 191, 36)", "Dark company link color");
  await page.getByRole("button", { name: "Theme: dark — click to toggle" }).click();
  await page.waitForFunction(() => getComputedStyle(document.querySelector(".company-link")).color === "rgb(180, 83, 9)");
  await page.screenshot({ path: "output/playwright/after-desktop-light.png", fullPage: true });
  report.screenshots.push("after-desktop-light.png");
  check(await page.locator(".activity-heatmap").evaluate(el => getComputedStyle(el).colorScheme) === "light", "SVG inherits selected theme");
  await page.getByRole("link", { name: "github", exact: true }).hover();
  await page.waitForFunction(() => getComputedStyle(document.querySelector(".footer-label")).opacity === "1");
  check(await page.locator(".footer-label").first().evaluate(el => el.getBoundingClientRect().width > 0), "Footer hover label");
  report.checks.push("dark/light themes, company colors, SVG theme inheritance, footer hover");
  const input = page.getByRole("textbox", { name: "terminal input" });
  await input.fill("activity");
  await input.press("Enter");
  check((await page.getByRole("log").innerText()).includes("last 12 weeks"), "Activity sparkline survives compact props");
  await input.fill("ls");
  await input.press("Enter");
  check((await page.getByRole("log").innerText()).includes("work.txt"), "ls output");
  await input.fill("cat about.md");
  await input.press("Enter");
  const aboutText = await page.getByRole("log").innerText();
  check(aboutText.includes("# studying") && aboutText.includes("Core Member") && !aboutText.includes("I'm Mohammed Elshrief"), "cat about.md preserves original content");
  await input.press("ArrowUp");
  check(await input.inputValue() === "cat about.md", "History recall");
  await input.fill("cat abo");
  await input.press("Tab");
  check((await input.inputValue()).includes("about.md"), "Tab completion");
  report.checks.push("activity sparkline, ls, cat about.md, command history, completion");
  await page.getByRole("button", { name: "Open command palette" }).click();
  check(await page.getByRole("dialog").isVisible(), "Command palette opens");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+k");
  check(await page.getByRole("dialog").isVisible(), "Keyboard palette opens");
  await page.keyboard.press("Escape");
  report.checks.push("command palette button and keyboard shortcut");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("link", { name: "mohammed elshrief", exact: true }).hover();
  check(await page.locator(".name-scramble").textContent() === "mohammed elshrief", "Reduced motion prevents scrambling");
  await page.locator(".sonic-sprite").hover();
  check(await page.locator(".sonic-sprite__run").evaluate(el => getComputedStyle(el).animationName) === "none", "Reduced motion freezes Sonic");
  report.checks.push("reduced motion");
  await page.getByRole("link", { name: "projects", exact: true }).click();
  await page.waitForURL("**/projects");
  check((await page.locator("main").innerText()).includes("TRACE"), "Projects survive shared shell change");
  await page.goto(base + "/writing/how-eduroam-works");
  check((await page.locator("main").innerText()).includes("The basic idea"), "eduroam article");
  await page.goto(base + "/writing/fairer-world-cup-schedule");
  check((await page.locator("main").innerText()).includes("What I learned"), "World Cup article");
  await page.goto(base + "/missing-browser-proof");
  await page.getByRole("link", { name: "cd ~", exact: true }).click();
  await page.waitForURL(base + "/");
  report.checks.push("projects, both published articles, 404 recovery");
  const browser = page.context().browser();
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1400 } });
  try {
    const staticPage = await nojs.newPage();
    await staticPage.goto(base);
    check((await staticPage.getByRole("heading", { level: 1 }).innerText()).replace("•", "").trim() === "mohammed elshrief", "No-JS H1");
    check((await staticPage.locator("main").innerText()).includes("Software Engineer Intern"), "No-JS roles");
    check(!(await staticPage.locator("main").innerText()).includes("I'm Mohammed Elshrief"), "No added bio without JavaScript");
    await staticPage.screenshot({ path: "output/playwright/after-no-js-desktop.png", fullPage: true });
    report.screenshots.push("after-no-js-desktop.png");
    report.checks.push("real JavaScript-disabled browser");
  } finally {
    await nojs.close();
  }
  const mobile = await browser.newContext({ viewport: { width: 390, height: 1000 }, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1" });
  try {
    const phone = await mobile.newPage();
    await phone.goto(base);
    check(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile overflow");
    await phone.getByRole("button", { name: "$ help", exact: true }).waitFor();
    await phone.screenshot({ path: "output/playwright/after-mobile-dark.png", fullPage: true });
    await phone.getByRole("button", { name: "Theme: dark — click to toggle" }).click();
    await phone.waitForFunction(() => getComputedStyle(document.querySelector(".company-link")).color === "rgb(180, 83, 9)" && getComputedStyle(document.querySelector(".pane")).backgroundColor === "rgba(250, 250, 249, 0.6)");
    await phone.screenshot({ path: "output/playwright/after-mobile-light.png", fullPage: true });
    check(await phone.locator(".activity-heatmap img").evaluate(el => el.currentSrc.endsWith("columns=26")), "Mobile heatmap");
    await phone.getByRole("button", { name: "$ help", exact: true }).click();
    check((await phone.getByRole("log").innerText()).includes("activity"), "Mobile chip command");
    report.screenshots.push("after-mobile-dark.png", "after-mobile-light.png");
    report.checks.push("390px mobile, no overflow, recent 26 weeks, touch command chips");
  } finally {
    await mobile.close();
  }
  return report;
})
