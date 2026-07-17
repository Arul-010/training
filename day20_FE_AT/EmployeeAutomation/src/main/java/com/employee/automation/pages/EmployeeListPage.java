package com.employee.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import java.util.List;

public class EmployeeListPage {

    private final WebDriver driver;

    public EmployeeListPage(WebDriver driver) {
        this.driver = driver;
    }

    // Locators
    private final By searchInput = By.className("search-box-input");
    private final By deptDropdown = By.xpath("(//select[@class='select-control-box'])[1]");
    private final By sortDropdown = By.xpath("(//select[@class='select-control-box'])[2]");
    private final By addEmployeeBtn = By.className("add-staff-btn-desktop");
    
    // Roster rows
    private final By rosterRows = By.className("roster-row");

    // Confirmation Modal Locators
    private final By cancelDeleteBtn = By.xpath("//button[contains(., 'Cancel')]");
    private final By confirmDeleteBtn = By.xpath("//button[contains(., 'Yes, Delete')]");

    public void enterSearchText(String text) {
        WebElement input = driver.findElement(searchInput);
        input.clear();
        input.sendKeys(text);
    }

    public void selectDepartment(String dept) {
        WebElement dropdown = driver.findElement(deptDropdown);
        Select select = new Select(dropdown);
        select.selectByVisibleText(dept);
    }

    public void selectSortBy(String sortOption) {
        WebElement dropdown = driver.findElement(sortDropdown);
        Select select = new Select(dropdown);
        select.selectByVisibleText(sortOption);
    }

    public void clickAddEmployee() {
        driver.findElement(addEmployeeBtn).click();
    }

    public List<WebElement> getEmployeeRows() {
        try {
            org.openqa.selenium.support.ui.WebDriverWait wait = new org.openqa.selenium.support.ui.WebDriverWait(driver, java.time.Duration.ofSeconds(10));
            wait.until(org.openqa.selenium.support.ui.ExpectedConditions.invisibilityOfElementLocated(By.className("loading-state-wrapper")));
        } catch (Exception e) {
            // Ignore
        }
        return driver.findElements(rosterRows);
    }

    public WebElement getEmployeeRowById(String employeeId) {
        List<WebElement> rows = getEmployeeRows();
        for (WebElement row : rows) {
            String rowId = row.findElement(By.className("roster-id")).getText();
            if (rowId.equalsIgnoreCase(employeeId)) {
                return row;
            }
        }
        return null;
    }

    public WebElement getEmployeeRowByName(String employeeName) {
        List<WebElement> rows = getEmployeeRows();
        for (WebElement row : rows) {
            String rowName = row.findElement(By.className("roster-name")).getText();
            if (rowName.equalsIgnoreCase(employeeName)) {
                return row;
            }
        }
        return null;
    }

    public void clickViewDetails(String employeeId) {
        WebElement row = getEmployeeRowById(employeeId);
        if (row != null) {
            row.findElement(By.className("view")).click();
        }
    }

    public void clickEditDetails(String employeeId) {
        WebElement row = getEmployeeRowById(employeeId);
        if (row != null) {
            row.findElement(By.className("edit")).click();
        }
    }

    public void clickDeleteEmployee(String employeeId) {
        WebElement row = getEmployeeRowById(employeeId);
        if (row != null) {
            row.findElement(By.className("delete")).click();
        }
    }

    public void confirmDeletion() {
        driver.findElement(confirmDeleteBtn).click();
    }

    public void cancelDeletion() {
        driver.findElement(cancelDeleteBtn).click();
    }
}
