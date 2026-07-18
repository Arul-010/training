package com.employee.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Page Object for the Employee Details page (/employees/:id).
 *
 * <p>Covers the profile header (name, status badge, role, ID), the
 * info-grid fields (email, phone, DOB, department, salary, join date),
 * and the action buttons (Edit Details, Delete Profile, Back to Roster).</p>
 */
public class EmployeeDetailsPage extends BasePage {

    // ── @FindBy — Header ───────────────────────────────────────────────────────

    /** Full name heading at the top of the profile card. */
    @FindBy(className = "details-full-name")
    private WebElement fullName;

    /** Status badge/pill showing Active / On Leave / Terminated. */
    @FindBy(className = "status-pill")
    private WebElement statusBadge;

    /** Role / designation line in the header. */
    @FindBy(className = "details-role-display")
    private WebElement roleDisplay;

    /** Employee ID line in the header. */
    @FindBy(className = "details-id-display")
    private WebElement idDisplay;

    // ── @FindBy — Info Grid (Personal & Contact) ───────────────────────────────

    @FindBy(xpath =
        "//div[span[text()='Email Address']]/*[contains(@class,'info-value')]")
    private WebElement emailValue;

    @FindBy(xpath =
        "//div[span[text()='Phone Number']]/*[contains(@class,'info-value')]")
    private WebElement phoneValue;

    @FindBy(xpath =
        "//div[span[text()='Date of Birth (D.O.B)']]/*[contains(@class,'info-value')]")
    private WebElement dobValue;

    // ── @FindBy — Info Grid (Employment) ──────────────────────────────────────

    @FindBy(xpath =
        "//div[span[text()='Department']]/*[contains(@class,'info-value')]")
    private WebElement deptValue;

    @FindBy(xpath =
        "//div[span[text()='Salary (Annual)']]//*[contains(@class,'info-value')]")
    private WebElement salaryValue;

    @FindBy(xpath =
        "//div[span[text()='Join Date']]/*[contains(@class,'info-value')]")
    private WebElement joinDateValue;

    // ── @FindBy — Action Buttons ───────────────────────────────────────────────

    @FindBy(xpath = "//button[contains(.,'Edit Details')]")
    private WebElement editDetailsBtn;

    @FindBy(xpath = "//button[contains(.,'Delete Profile')]")
    private WebElement deleteProfileBtn;

    @FindBy(xpath = "//button[contains(.,'Back to Roster')]")
    private WebElement backToRosterBtn;

    // ── Constructor ────────────────────────────────────────────────────────────

    public EmployeeDetailsPage(WebDriver driver) {
        super(driver);
    }

    // ── Header Getters ─────────────────────────────────────────────────────────

    /** @return the employee's full name from the profile header. */
    public String getFullName() {
        return waitForVisible(fullName).getText();
    }

    /**
     * @return the status badge text (e.g. "Active", "On Leave",
     *         "Terminated") from the profile header.
     */
    public String getStatus() {
        return waitForVisible(statusBadge).getText();
    }

    /** @return the role / designation text from the profile header. */
    public String getRole() {
        return waitForVisible(roleDisplay).getText();
    }

    /** @return the employee ID (e.g. "EMP-1234") from the profile header. */
    public String getId() {
        return waitForVisible(idDisplay).getText();
    }

    // ── Info Grid Getters ──────────────────────────────────────────────────────

    /** @return the email address from the info grid. */
    public String getEmail() {
        return waitForVisible(emailValue).getText();
    }

    /** @return the phone number from the info grid. */
    public String getPhone() {
        return waitForVisible(phoneValue).getText();
    }

    /** @return the formatted date of birth from the info grid. */
    public String getDob() {
        return waitForVisible(dobValue).getText();
    }

    /** @return the department name from the info grid. */
    public String getDepartment() {
        return waitForVisible(deptValue).getText();
    }

    /**
     * @return the formatted annual salary (e.g. "$120,000") from
     *         the info grid.
     */
    public String getSalary() {
        return waitForVisible(salaryValue).getText();
    }

    /** @return the formatted join date from the info grid. */
    public String getJoinDate() {
        return waitForVisible(joinDateValue).getText();
    }

    // ── Action Buttons ─────────────────────────────────────────────────────────

    /** Click "Edit Details" to navigate to the edit form. */
    public void clickEditDetails() {
        waitForClickable(editDetailsBtn).click();
    }

    /**
     * Click "Delete Profile" to open the delete confirmation modal.
     * Call {@link EmployeeListPage#confirmDeletion()} afterwards.
     */
    public void clickDeleteProfile() {
        waitForClickable(deleteProfileBtn).click();
    }

    /** Click "Back to Roster" to return to the employee list. */
    public void clickBackToRoster() {
        waitForClickable(backToRosterBtn).click();
    }
}
