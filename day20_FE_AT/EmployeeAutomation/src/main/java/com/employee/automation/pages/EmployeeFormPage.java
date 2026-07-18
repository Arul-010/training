package com.employee.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Page Object for the Add / Edit Employee Form page.
 *
 * <p>Used for both:
 * <ul>
 *   <li><b>Add mode</b> — {@code /employees/new}</li>
 *   <li><b>Edit mode</b> — {@code /employees/edit/:id}</li>
 * </ul>
 *
 * The "Employment Status" select is only rendered in edit mode,
 * so {@link #selectStatus(String)} does nothing if the field is absent.</p>
 */
public class EmployeeFormPage extends BasePage {

    // ── @FindBy — Text / Number / Date Inputs ─────────────────────────────────

    @FindBy(id = "name")
    private WebElement nameInput;

    @FindBy(id = "email")
    private WebElement emailInput;

    @FindBy(id = "phone")
    private WebElement phoneInput;

    @FindBy(id = "salary")
    private WebElement salaryInput;

    @FindBy(id = "joinDate")
    private WebElement joinDateInput;

    @FindBy(id = "dob")
    private WebElement dobInput;

    // ── @FindBy — Selects ──────────────────────────────────────────────────────

    @FindBy(id = "department")
    private WebElement deptSelect;

    /**
     * Employment Status select — only present in edit mode.
     * Never hold a hard reference; always re-find.
     */
    private static final By STATUS_SELECT_BY = By.id("status");

    // ── @FindBy — Role Autocomplete ────────────────────────────────────────────

    @FindBy(id = "role")
    private WebElement roleInput;

    // ── @FindBy — Form Buttons ─────────────────────────────────────────────────

    @FindBy(xpath = "//button[@type='submit']")
    private WebElement submitBtn;

    @FindBy(xpath = "//button[contains(.,'Discard') or contains(.,'Cancel')]")
    private WebElement discardBtn;

    // ── Constructor ────────────────────────────────────────────────────────────

    public EmployeeFormPage(WebDriver driver) {
        super(driver);
    }

    // ── Field Setters ──────────────────────────────────────────────────────────

    /**
     * Clear and type into the Full Name field.
     */
    public void enterFullName(String name) {
        WebElement el = waitForVisible(nameInput);
        el.clear();
        el.sendKeys(name);
    }

    /**
     * Clear and type into the Email Address field.
     */
    public void enterEmail(String email) {
        WebElement el = waitForVisible(emailInput);
        el.clear();
        el.sendKeys(email);
    }

    /**
     * Clear and type into the Phone Number field.
     */
    public void enterPhone(String phone) {
        WebElement el = waitForVisible(phoneInput);
        el.clear();
        el.sendKeys(phone);
    }

    /**
     * Select a department from the dropdown by visible text.
     *
     * @param dept e.g. "Engineering", "HR"
     */
    public void selectDepartment(String dept) {
        jsSetSelect(waitForVisible(deptSelect), dept);
    }

    /**
     * Type a role name and click the first matching autocomplete option
     * if the suggestions list appears.
     *
     * @param role e.g. "Software Engineer"
     */
    public void enterRole(String role) {
        WebElement el = waitForVisible(roleInput);
        el.clear();
        el.sendKeys(role);
        try {
            Thread.sleep(500); // allow suggestions to render
            WebElement option = driver.findElement(By.xpath(
                "//li[contains(@class,'role-dropdown-item') " +
                "and contains(text(),'" + role + "')]"));
            option.click();
        } catch (Exception ignored) {
            // No autocomplete shown — typed value is used as-is
        }
    }

    /**
     * Set the Salary field using the React-native JS setter so that
     * React's controlled-input state is updated correctly.
     *
     * @param salary numeric string e.g. "120000"
     */
    public void enterSalary(String salary) {
        jsSetValue(waitForVisible(salaryInput), salary);
    }

    /**
     * Set the Join Date field (type=date) using the JS native setter.
     *
     * @param date ISO date string e.g. "2026-07-01"
     */
    public void enterJoinDate(String date) {
        jsSetValue(waitForVisible(joinDateInput), date);
    }

    /**
     * Set the Date of Birth field (type=date) using the JS native setter.
     *
     * @param dob ISO date string e.g. "1998-05-15"
     */
    public void enterDob(String dob) {
        jsSetValue(waitForVisible(dobInput), dob);
    }

    /**
     * Set the Employment Status dropdown by matching the visible option
     * text (edit mode only).
     *
     * <p>Uses the JS select setter to fire a React-compatible change event.</p>
     *
     * @param status "Active", "On Leave", or "Terminated"
     */
    public void selectStatus(String status) {
        // Re-find the element each call — it's conditionally rendered
        java.util.List<WebElement> els = driver.findElements(STATUS_SELECT_BY);
        if (!els.isEmpty()) {
            jsSetSelect(waitForVisible(els.get(0)), status);
        }
    }

    // ── Form Submission ────────────────────────────────────────────────────────

    /** Click the submit button ("Add Employee" or "Update Profile"). */
    public void clickSubmit() {
        waitForClickable(submitBtn).click();
    }

    /** Click the Discard / Cancel button to abandon the form. */
    public void clickDiscard() {
        waitForClickable(discardBtn).click();
    }
}
