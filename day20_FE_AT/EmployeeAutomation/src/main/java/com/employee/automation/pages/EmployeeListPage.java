package com.employee.automation.pages;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;

/**
 * Page Object for the Employee Roster / List page (/employees).
 *
 * <p>Covers search, department filter, sort, the roster table rows,
 * inline action buttons (view / edit / delete), and the delete
 * confirmation modal.</p>
 */
public class EmployeeListPage extends BasePage {

    // ── @FindBy — Toolbar ──────────────────────────────────────────────────────

    @FindBy(className = "search-box-input")
    private WebElement searchInput;

    /** First select on the toolbar — Department filter. */
    @FindBy(xpath = "(//select[@class='select-control-box'])[1]")
    private WebElement deptDropdown;

    /** Second select on the toolbar — Sort By. */
    @FindBy(xpath = "(//select[@class='select-control-box'])[2]")
    private WebElement sortDropdown;

    /** "Add Employee" button (desktop variant). */
    @FindBy(className = "add-staff-btn-desktop")
    private WebElement addEmployeeBtn;

    // ── @FindBy — Roster Rows ──────────────────────────────────────────────────

    @FindBy(className = "roster-row")
    private List<WebElement> rosterRows;

    // ── @FindBy — Delete Confirmation Modal ───────────────────────────────────

    @FindBy(xpath = "//button[contains(.,'Yes, Delete')]")
    private WebElement confirmDeleteBtn;

    @FindBy(xpath = "//button[contains(.,'Cancel')]")
    private WebElement cancelDeleteBtn;

    // ── Constructor ────────────────────────────────────────────────────────────

    public EmployeeListPage(WebDriver driver) {
        super(driver);
    }

    // ── Toolbar Actions ────────────────────────────────────────────────────────

    /**
     * Type text into the search box, waiting for it to be visible first.
     *
     * @param text search term (pass {@code ""} to clear the search)
     */
    public void enterSearchText(String text) {
        WebElement input = waitForVisible(searchInput);
        input.clear();
        input.sendKeys(text);
    }

    /**
     * Filter the roster by department using the visible option text.
     *
     * @param dept e.g. "Engineering", "HR", or "All Departments"
     */
    public void selectDepartment(String dept) {
        new Select(waitForVisible(deptDropdown)).selectByVisibleText(dept);
    }

    /**
     * Change the sort order using the visible option text.
     *
     * @param sortOption e.g. "Name A–Z", "Salary ↑"
     */
    public void selectSortBy(String sortOption) {
        new Select(waitForVisible(sortDropdown)).selectByVisibleText(sortOption);
    }

    /** Click the "Add Employee" button. */
    public void clickAddEmployee() {
        waitForClickable(addEmployeeBtn).click();
    }

    // ── Row Accessors ──────────────────────────────────────────────────────────

    /**
     * Return all visible roster rows, waiting for any loading spinner
     * to finish first.
     */
    public List<WebElement> getEmployeeRows() {
        waitForLoadingToFinish();
        return driver.findElements(By.className("roster-row"));
    }

    /**
     * Find the first roster row whose ID cell exactly matches
     * {@code employeeId} (case-insensitive).
     *
     * @return matching {@link WebElement} or {@code null} if not found
     */
    public WebElement getEmployeeRowById(String employeeId) {
        for (WebElement row : getEmployeeRows()) {
            String rowId = row.findElement(By.className("roster-id")).getText();
            if (rowId.equalsIgnoreCase(employeeId)) return row;
        }
        return null;
    }

    /**
     * Find the first roster row whose Name cell exactly matches
     * {@code employeeName} (case-insensitive).
     *
     * @return matching {@link WebElement} or {@code null} if not found
     */
    public WebElement getEmployeeRowByName(String employeeName) {
        for (WebElement row : getEmployeeRows()) {
            String rowName = row.findElement(By.className("roster-name")).getText();
            if (rowName.equalsIgnoreCase(employeeName)) return row;
        }
        return null;
    }

    // ── Row-Level Actions ──────────────────────────────────────────────────────

    /**
     * Click the "View Details" (eye) icon for the row with the given ID.
     */
    public void clickViewDetails(String employeeId) {
        WebElement row = getEmployeeRowById(employeeId);
        if (row != null) row.findElement(By.className("view")).click();
    }

    /**
     * Click the "Edit" (pencil) icon for the row with the given ID.
     */
    public void clickEditEmployee(String employeeId) {
        WebElement row = getEmployeeRowById(employeeId);
        if (row != null) row.findElement(By.className("edit")).click();
    }

    /**
     * Click the "Delete" (trash) icon for the row with the given ID.
     */
    public void clickDeleteEmployee(String employeeId) {
        WebElement row = getEmployeeRowById(employeeId);
        if (row != null) row.findElement(By.className("delete")).click();
    }

    // ── Delete Confirmation Modal ──────────────────────────────────────────────

    /** Click "Yes, Delete" in the confirmation modal. */
    public void confirmDeletion() {
        wait.until(ExpectedConditions.elementToBeClickable(confirmDeleteBtn)).click();
    }

    /** Click "Cancel" in the confirmation modal. */
    public void cancelDeletion() {
        wait.until(ExpectedConditions.elementToBeClickable(cancelDeleteBtn)).click();
    }
}
