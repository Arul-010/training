package com.employee.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

public class EmployeeFormPage {

    private final WebDriver driver;

    public EmployeeFormPage(WebDriver driver) {
        this.driver = driver;
    }

    // Locators
    private final By nameInput = By.id("name");
    private final By emailInput = By.id("email");
    private final By phoneInput = By.id("phone");
    private final By deptSelect = By.id("department");
    private final By roleInput = By.id("role");
    private final By salaryInput = By.id("salary");
    private final By joinDateInput = By.id("joinDate");
    private final By dobInput = By.id("dob");
    private final By statusSelect = By.id("status");

    private final By discardBtn = By.xpath("//button[contains(., 'Discard') or contains(., 'Cancel')]");
    private final By submitBtn = By.xpath("//button[@type='submit']");

    public void enterFullName(String name) {
        WebElement input = driver.findElement(nameInput);
        input.clear();
        input.sendKeys(name);
    }

    public void enterEmail(String email) {
        WebElement input = driver.findElement(emailInput);
        input.clear();
        input.sendKeys(email);
    }

    public void enterPhone(String phone) {
        WebElement input = driver.findElement(phoneInput);
        input.clear();
        input.sendKeys(phone);
    }

    public void selectDepartment(String dept) {
        WebElement dropdown = driver.findElement(deptSelect);
        Select select = new Select(dropdown);
        select.selectByVisibleText(dept);
    }

    public void enterRole(String role) {
        WebElement input = driver.findElement(roleInput);
        input.clear();
        input.sendKeys(role);
        
        // Click on the autocomplete option if visible
        try {
            Thread.sleep(500); // Wait for suggestions to render
            By optionLocator = By.xpath("//li[contains(@class, 'role-dropdown-item') and contains(text(), '" + role + "')]");
            if (driver.findElements(optionLocator).size() > 0) {
                driver.findElement(optionLocator).click();
            }
        } catch (Exception e) {
            // Option wasn't clicked, but input text is set
        }
    }

    public void enterSalary(String salary) {
        WebElement input = driver.findElement(salaryInput);
        // Use JS native setter so React's onChange fires correctly
        org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
        js.executeScript(
            "var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; " +
            "nativeInputValueSetter.call(arguments[0], arguments[1]); " +
            "arguments[0].dispatchEvent(new Event('input', { bubbles: true })); " +
            "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
            input, salary
        );
    }

    private void setDateViaJS(WebElement element, String dateValue) {
        org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
        js.executeScript(
            "var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; " +
            "nativeInputValueSetter.call(arguments[0], arguments[1]); " +
            "arguments[0].dispatchEvent(new Event('input', { bubbles: true })); " +
            "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", 
            element, dateValue
        );
    }

    public void enterJoinDate(String joinDate) {
        WebElement input = driver.findElement(joinDateInput);
        setDateViaJS(input, joinDate);
    }

    public void enterDob(String dob) {
        WebElement input = driver.findElement(dobInput);
        setDateViaJS(input, dob);
    }

    public void selectStatus(String status) {
        WebElement dropdown = driver.findElement(statusSelect);
        org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
        js.executeScript(
            "var select = arguments[0]; " +
            "var valueToSet = ''; " +
            "for (var i = 0; i < select.options.length; i++) { " +
            "    if (select.options[i].text === arguments[1]) { " +
            "        valueToSet = select.options[i].value; " +
            "        break; " +
            "    } " +
            "} " +
            "select.value = valueToSet; " +
            "select.dispatchEvent(new Event('change', { bubbles: true }));",
            dropdown, status
        );
    }

    public void clickSubmit() {
        driver.findElement(submitBtn).click();
    }

    public void clickDiscard() {
        driver.findElement(discardBtn).click();
    }
}
