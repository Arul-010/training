package com.employee.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

public class DashboardPage {

    private final WebDriver driver;

    public DashboardPage(WebDriver driver) {
        this.driver = driver;
    }

    // Metric locators
    private final By totalEmployeesVal = By.xpath("//span[text()='Total Employees']/following-sibling::strong");
    private final By openPositionsVal = By.xpath("//span[text()='Open Positions']/following-sibling::strong");
    private final By leaveRequestsVal = By.xpath("//span[text()='Leave Requests']/following-sibling::strong");
    private final By lateInflowsVal = By.xpath("//span[text()='Late Inflows']/following-sibling::strong");

    // Timeframe dropdown
    private final By timeframeDropdown = By.className("timeframe-badge-dropdown");

    // Sidebar navigation locators
    private final By dashboardLink = By.xpath("//a[contains(@href, '/dashboard')]");
    private final By employeesLink = By.xpath("//a[contains(@href, '/employees') and not(contains(@href, '/new'))]");
    private final By projectsLink = By.xpath("//a[contains(@href, '/projects')]");
    private final By helpdeskLink = By.xpath("//a[contains(@href, '/queries')]");
    private final By addEmployeeLink = By.xpath("//a[contains(@href, '/employees/new')]");
    private final By signOutBtn = By.xpath("//button[contains(@class, 'sidebar-logout-btn-full') or contains(., 'Sign Out')]");

    public String getTotalEmployees() {
        return driver.findElement(totalEmployeesVal).getText();
    }

    public String getOpenPositions() {
        return driver.findElement(openPositionsVal).getText();
    }

    public String getLeaveRequests() {
        return driver.findElement(leaveRequestsVal).getText();
    }

    public String getLateInflows() {
        return driver.findElement(lateInflowsVal).getText();
    }

    public void selectTimeframe(String value) {
        WebElement dropdown = driver.findElement(timeframeDropdown);
        Select select = new Select(dropdown);
        select.selectByVisibleText(value);
    }

    public void navigateToDashboard() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(dashboardLink));
    }

    public void navigateToEmployees() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(employeesLink));
    }

    public void navigateToProjects() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(projectsLink));
    }

    public void navigateToHelpdesk() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(helpdeskLink));
    }

    public void navigateToAddEmployee() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(addEmployeeLink));
    }

    public void signOut() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(signOutBtn));
    }
}
