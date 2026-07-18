package com.employee.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.Select;

/**
 * Page Object for the Admin Dashboard page (/dashboard).
 *
 * <p>Covers the four KPI metric cards, the timeframe dropdown,
 * and all sidebar navigation links.</p>
 */
public class DashboardPage extends BasePage {

    // ── @FindBy — Metric Cards ─────────────────────────────────────────────────

    @FindBy(xpath = "//span[text()='Total Employees']/following-sibling::strong")
    private WebElement totalEmployeesVal;

    @FindBy(xpath = "//span[text()='Open Positions']/following-sibling::strong")
    private WebElement openPositionsVal;

    @FindBy(xpath = "//span[text()='Leave Requests']/following-sibling::strong")
    private WebElement leaveRequestsVal;

    @FindBy(xpath = "//span[text()='Late Inflows']/following-sibling::strong")
    private WebElement lateInflowsVal;

    // ── @FindBy — Timeframe Dropdown ───────────────────────────────────────────

    @FindBy(className = "timeframe-badge-dropdown")
    private WebElement timeframeDropdown;

    // ── @FindBy — Sidebar Navigation ──────────────────────────────────────────

    @FindBy(xpath = "//a[contains(@href, '/dashboard')]")
    private WebElement dashboardLink;

    /** Employees roster link — excludes /employees/new. */
    @FindBy(xpath = "//a[contains(@href, '/employees') and not(contains(@href, '/new'))]")
    private WebElement employeesLink;

    @FindBy(xpath = "//a[contains(@href, '/projects')]")
    private WebElement projectsLink;

    @FindBy(xpath = "//a[contains(@href, '/queries')]")
    private WebElement helpdeskLink;

    @FindBy(xpath = "//a[contains(@href, '/employees/new')]")
    private WebElement addEmployeeLink;

    @FindBy(xpath = "//button[contains(@class,'sidebar-logout-btn-full') or contains(.,'Sign Out')]")
    private WebElement signOutBtn;

    // ── Constructor ────────────────────────────────────────────────────────────

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    // ── Metric Getters ─────────────────────────────────────────────────────────

    /** @return text of the Total Employees KPI card. */
    public String getTotalEmployees() {
        return waitForVisible(totalEmployeesVal).getText();
    }

    /** @return text of the Open Positions KPI card. */
    public String getOpenPositions() {
        return waitForVisible(openPositionsVal).getText();
    }

    /** @return text of the Leave Requests KPI card. */
    public String getLeaveRequests() {
        return waitForVisible(leaveRequestsVal).getText();
    }

    /** @return text of the Late Inflows KPI card. */
    public String getLateInflows() {
        return waitForVisible(lateInflowsVal).getText();
    }

    // ── Timeframe Dropdown ─────────────────────────────────────────────────────

    /**
     * Select the chart timeframe by visible option text
     * (e.g. "This Week", "This Month").
     */
    public void selectTimeframe(String visibleText) {
        new Select(waitForVisible(timeframeDropdown))
                .selectByVisibleText(visibleText);
    }

    // ── Sidebar Navigation ─────────────────────────────────────────────────────

    /** Navigate to the Dashboard page via the sidebar link. */
    public void navigateToDashboard() {
        jsClick(dashboardLink);
    }

    /** Navigate to the Employees Roster via the sidebar link. */
    public void navigateToEmployees() {
        jsClick(employeesLink);
    }

    /** Navigate to the Projects page via the sidebar link. */
    public void navigateToProjects() {
        jsClick(projectsLink);
    }

    /** Navigate to the Helpdesk (Queries) page via the sidebar link. */
    public void navigateToHelpdesk() {
        jsClick(helpdeskLink);
    }

    /** Navigate to the Add Employee form via the sidebar link. */
    public void navigateToAddEmployee() {
        jsClick(addEmployeeLink);
    }

    /** Click the Sign Out button in the sidebar. */
    public void signOut() {
        jsClick(signOutBtn);
    }
}
