package com.employee.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class EmployeeDetailsPage {

    private final WebDriver driver;

    public EmployeeDetailsPage(WebDriver driver) {
        this.driver = driver;
    }

    // Locators
    private final By backToRosterBtn = By.xpath("//button[contains(., 'Back to Roster')]");
    
    // Header Info
    private final By fullName = By.className("details-full-name");
    private final By statusBadge = By.className("status-pill");
    private final By roleDisplay = By.className("details-role-display");
    private final By idDisplay = By.className("details-id-display");
    
    // Detail rows
    private final By emailValue = By.xpath("//div[span[text()='Email Address']]/*[contains(@class,'info-value')]");
    private final By phoneValue = By.xpath("//div[span[text()='Phone Number']]/*[contains(@class,'info-value')]");
    private final By dobValue = By.xpath("//div[span[text()='Date of Birth (D.O.B)']]/*[contains(@class,'info-value')]");
    private final By deptValue = By.xpath("//div[span[text()='Department']]/*[contains(@class,'info-value')]");
    private final By salaryValue = By.xpath("//div[span[text()='Salary (Annual)']]/*[contains(@class,'info-value')]");
    private final By joinDateValue = By.xpath("//div[span[text()='Join Date']]/*[contains(@class,'info-value')]");

    // Action buttons
    private final By editDetailsBtn = By.xpath("//button[contains(., 'Edit Details')]");
    private final By deleteProfileBtn = By.xpath("//button[contains(., 'Delete Profile')]");

    public void clickBackToRoster() {
        driver.findElement(backToRosterBtn).click();
    }

    public String getFullName() {
        return driver.findElement(fullName).getText();
    }

    public String getStatus() {
        return driver.findElement(statusBadge).getText();
    }

    public String getRole() {
        return driver.findElement(roleDisplay).getText();
    }

    public String getId() {
        return driver.findElement(idDisplay).getText();
    }

    public String getEmail() {
        return driver.findElement(emailValue).getText();
    }

    public String getPhone() {
        return driver.findElement(phoneValue).getText();
    }

    public String getDob() {
        return driver.findElement(dobValue).getText();
    }

    public String getDepartment() {
        return driver.findElement(deptValue).getText();
    }

    public String getSalary() {
        return driver.findElement(salaryValue).getText();
    }

    public String getJoinDate() {
        return driver.findElement(joinDateValue).getText();
    }

    public void clickEditDetails() {
        driver.findElement(editDetailsBtn).click();
    }

    public void clickDeleteProfile() {
        driver.findElement(deleteProfileBtn).click();
    }
}
