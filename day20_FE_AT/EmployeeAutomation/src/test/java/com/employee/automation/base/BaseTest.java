package com.employee.automation.base;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

import io.github.bonigarcia.wdm.WebDriverManager;

public class BaseTest {

    private static final java.util.logging.Logger[] loggers = new java.util.logging.Logger[] {
        java.util.logging.Logger.getLogger("org.openqa.selenium"),
        java.util.logging.Logger.getLogger("org.openqa.selenium.devtools.CdpVersionFinder"),
        java.util.logging.Logger.getLogger("org.openqa.selenium.chromium.ChromiumDriver"),
        java.util.logging.Logger.getLogger("org.openqa.selenium.remote.ProtocolHandshake")
    };

    static {
        System.setProperty("webdriver.chrome.silentOutput", "true");
        System.setProperty("webdriver.chrome.silentLogging", "true");
        System.setProperty("webdriver.chrome.args", "--disable-logging");
        for (java.util.logging.Logger logger : loggers) {
            logger.setLevel(java.util.logging.Level.OFF);
        }
    }

    // Shared single browser instance for the entire suite
    protected static WebDriver driver;

    @BeforeSuite
    public void setUp() {

        // Setup ChromeDriver
        WebDriverManager.chromedriver().setup();

        // Launch Chrome once for the whole suite
        driver = new ChromeDriver();

        // Maximize browser
        driver.manage().window().maximize();

        // Open login page
        driver.get("http://localhost:5173/login");

        // Keep sidebar collapsed by default on load to avoid mobile overlay backdrop on desktop
        try {
            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("localStorage.setItem('ems_sidebar_pinned', 'false');");
            driver.navigate().refresh();
            Thread.sleep(1500);
        } catch (Exception e) {
            System.err.println("Could not unpin sidebar: " + e.getMessage());
        }
    }

    /**
     * Clears auth state from localStorage and navigates to the login page.
     * Preserves ems_deleted_ids so deleted employees don't reappear after sync.
     * Waits until the role-picker buttons are visible before returning.
     */
    protected void navigateToLogin() {
        try {
            // Preserve deleted-IDs list before clearing, so background sync won't re-add them
            String deletedIds = (String) ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript("return window.localStorage.getItem('ems_deleted_ids');");
            // Clear auth token so the app doesn't auto-redirect to dashboard
            ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript("window.localStorage.clear(); window.sessionStorage.clear();");
            // Restore deleted IDs
            if (deletedIds != null && !deletedIds.isEmpty()) {
                ((org.openqa.selenium.JavascriptExecutor) driver)
                    .executeScript("window.localStorage.setItem('ems_deleted_ids', arguments[0]);", deletedIds);
            }
        } catch (Exception ignored) {
            // If the page hasn't loaded JS yet, just continue
        }

        driver.get("http://localhost:5173/login");

        // Wait until the role-picker buttons appear on screen
        try {
            org.openqa.selenium.support.ui.WebDriverWait wait =
                new org.openqa.selenium.support.ui.WebDriverWait(driver, java.time.Duration.ofSeconds(10));
            wait.until(org.openqa.selenium.support.ui.ExpectedConditions
                .visibilityOfElementLocated(org.openqa.selenium.By.xpath(
                    "//button[contains(text(),'Administrator') or contains(text(),'Employee')]")));
        } catch (Exception e) {
            System.err.println("Login page role buttons not found after navigation: " + e.getMessage());
        }
    }


    public void clickElementJS(org.openqa.selenium.WebElement element) {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    @AfterSuite
    public void tearDown() {

        if (driver != null) {

            // Wait 3 seconds before closing browser
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            driver.quit();
        }
    }
}