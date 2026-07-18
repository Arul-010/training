package com.employee.automation.base;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

import io.github.bonigarcia.wdm.WebDriverManager;

public class BaseTest {

    protected static WebDriver driver;

    private static final String BASE_URL =
            "http://localhost:5173";

    private static final String LOGIN_URL =
            BASE_URL + "/login";

    @BeforeSuite
    public void setUp() {

        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        driver.manage().timeouts().implicitlyWait(
                Duration.ofSeconds(10)
        );

        driver.manage().timeouts().pageLoadTimeout(
                Duration.ofSeconds(30)
        );

        driver.get(LOGIN_URL);

        try {

            JavascriptExecutor js =
                    (JavascriptExecutor) driver;

            js.executeScript(
                    "localStorage.setItem(" +
                    "'ems_sidebar_pinned', 'false');"
            );

            driver.navigate().refresh();

        } catch (Exception e) {

            System.out.println(
                    "Sidebar setup failed: "
                    + e.getMessage()
            );
        }
    }

    protected void navigateToLogin() {

        try {

            JavascriptExecutor js =
                    (JavascriptExecutor) driver;

            String deletedIds =
                    (String) js.executeScript(
                            "return localStorage.getItem(" +
                            "'ems_deleted_ids');"
                    );

            js.executeScript(
                    "localStorage.clear();" +
                    "sessionStorage.clear();"
            );

            if (deletedIds != null) {

                js.executeScript(
                        "localStorage.setItem(" +
                        "'ems_deleted_ids', arguments[0]);",
                        deletedIds
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Could not clear login state: "
                    + e.getMessage()
            );
        }

        driver.get(LOGIN_URL);

        WebDriverWait wait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(10)
                );

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//button[contains(text()," +
                            "'Administrator') or " +
                            "contains(text(),'Employee')]"
                        )
                )
        );
    }

    protected void clickElementJS(
            org.openqa.selenium.WebElement element) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        js.executeScript(
                "arguments[0].click();",
                element
        );
    }

    @AfterSuite
    public void tearDown() {

        if (driver != null) {

            try {

                Thread.sleep(3000);

            } catch (InterruptedException e) {

                Thread.currentThread().interrupt();
            }

            driver.quit();
        }
    }
}