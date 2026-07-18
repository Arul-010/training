package com.employee.automation.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * BasePage — Root of the Page Object Model hierarchy.
 *
 * <p>Every page class extends this base to get:
 * <ul>
 *   <li>Automatic {@link PageFactory#initElements} so that all
 *       {@code @FindBy}-annotated fields are lazily initialised.</li>
 *   <li>A pre-configured {@link WebDriverWait} (10 s default).</li>
 *   <li>Shared utility methods: JS click, JS value setter, wait for
 *       visibility / invisibility, scroll-into-view, etc.</li>
 * </ul>
 */
public abstract class BasePage {

    protected final WebDriver driver;
    protected final WebDriverWait wait;

    private static final int DEFAULT_TIMEOUT_SECONDS = 10;

    // ── Constructor ────────────────────────────────────────────────────────────

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver,
                Duration.ofSeconds(DEFAULT_TIMEOUT_SECONDS));
        // Initialise all @FindBy-annotated fields in the subclass
        PageFactory.initElements(driver, this);
    }

    // ── Wait utilities ─────────────────────────────────────────────────────────

    /**
     * Wait until the element located by {@code locator} is visible,
     * then return it.
     */
    protected WebElement waitForVisible(By locator) {
        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /**
     * Wait until the given {@link WebElement} (already found) is visible.
     */
    protected WebElement waitForVisible(WebElement element) {
        return wait.until(
                ExpectedConditions.visibilityOf(element));
    }

    /**
     * Wait until the element located by {@code locator} is clickable,
     * then return it.
     */
    protected WebElement waitForClickable(By locator) {
        return wait.until(
                ExpectedConditions.elementToBeClickable(locator));
    }

    /**
     * Wait until the given {@link WebElement} (already found via
     * {@code @FindBy}) is clickable, then return it.
     */
    protected WebElement waitForClickable(WebElement element) {
        return wait.until(
                ExpectedConditions.elementToBeClickable(element));
    }

    /**
     * Wait until a loading spinner (class {@code loading-state-wrapper})
     * disappears from the DOM so the page content is fully rendered.
     */
    protected void waitForLoadingToFinish() {
        try {
            wait.until(ExpectedConditions.invisibilityOfElementLocated(
                    By.className("loading-state-wrapper")));
        } catch (Exception ignored) {
            // Spinner may never appear for fast operations — that's fine.
        }
    }

    // ── JavaScript helpers ─────────────────────────────────────────────────────

    /**
     * Click an element via JavaScript — bypasses intercepting overlays
     * and React synthetic event issues.
     */
    protected void jsClick(WebElement element) {
        ((JavascriptExecutor) driver)
                .executeScript("arguments[0].click();", element);
    }

    /**
     * Set a React-controlled {@code <input>} value via the native
     * HTMLInputElement value setter and fire both {@code input} and
     * {@code change} events so that React's state is updated correctly.
     *
     * <p>Use this instead of {@code sendKeys} whenever the field is a
     * React-controlled component (type=text, number, date, etc.).</p>
     */
    protected void jsSetValue(WebElement element, String value) {
        ((JavascriptExecutor) driver).executeScript(
            "var setter = Object.getOwnPropertyDescriptor(" +
            "    window.HTMLInputElement.prototype, 'value').set;" +
            "setter.call(arguments[0], arguments[1]);" +
            "arguments[0].dispatchEvent(new Event('input',  { bubbles: true }));" +
            "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
            element, value
        );
    }

    /**
     * Set a React-controlled {@code <select>} value by matching the
     * visible option text, then dispatching a {@code change} event.
     */
    protected void jsSetSelect(WebElement selectElement, String visibleText) {
        ((JavascriptExecutor) driver).executeScript(
            "var sel = arguments[0];" +
            "var target = arguments[1];" +
            "for (var i = 0; i < sel.options.length; i++) {" +
            "  if (sel.options[i].text === target) {" +
            "    sel.value = sel.options[i].value; break;" +
            "  }" +
            "}" +
            "sel.dispatchEvent(new Event('change', { bubbles: true }));",
            selectElement, visibleText
        );
    }

    /**
     * Scroll the given element into the browser viewport before
     * interacting with it — useful for items below the fold.
     */
    protected void scrollIntoView(WebElement element) {
        ((JavascriptExecutor) driver)
                .executeScript(
                    "arguments[0].scrollIntoView({ behavior: 'smooth'," +
                    " block: 'center' });",
                    element);
    }

    // ── Page-level helpers ─────────────────────────────────────────────────────

    /**
     * Return the current browser URL.
     */
    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    /**
     * Return the current page title.
     */
    public String getPageTitle() {
        return driver.getTitle();
    }
}
