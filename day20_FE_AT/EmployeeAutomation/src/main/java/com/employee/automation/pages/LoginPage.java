package com.employee.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Page Object for the Login page (http://localhost:5173/login).
 *
 * <p>Covers the role-selector tabs and the two sign-in actions
 * (Administrator and Employee).</p>
 */
public class LoginPage extends BasePage {

    // ── @FindBy locators ───────────────────────────────────────────────────────

    /** "Administrator" role-selector tab button. */
    @FindBy(xpath = "//button[contains(text(),'Administrator')]")
    private WebElement adminTab;

    /** "Employee" role-selector tab button. */
    @FindBy(xpath = "//button[contains(text(),'Employee')]")
    private WebElement employeeTab;

    /** Employee-name / ID text field (visible only in Employee tab). */
    @FindBy(xpath = "//input[@placeholder='e.g. Arul Selvam or EMP-1001']")
    private WebElement employeeNameInput;

    /** "Sign In as Admin" submit button. */
    @FindBy(xpath = "//button[contains(.,'Sign In as Admin')]")
    private WebElement adminLoginBtn;

    /** "Sign In as Employee" submit button. */
    @FindBy(xpath = "//button[contains(.,'Sign In as Employee')]")
    private WebElement employeeLoginBtn;

    // ── Constructor ────────────────────────────────────────────────────────────

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    // ── Actions ────────────────────────────────────────────────────────────────

    /**
     * Select the Administrator tab then click "Sign In as Admin".
     */
    public void loginAsAdmin() {
        waitForVisible(adminTab).click();
        waitForClickable(adminLoginBtn).click();
    }

    /**
     * Select the Employee tab, type the employee name / ID,
     * then click "Sign In as Employee".
     *
     * @param name employee name or EMP-xxxx ID shown on the login page
     */
    public void loginAsEmployee(String name) {
        waitForVisible(employeeTab).click();
        WebElement input = waitForVisible(employeeNameInput);
        input.clear();
        input.sendKeys(name);
        waitForClickable(employeeLoginBtn).click();
    }
}
