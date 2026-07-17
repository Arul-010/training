package com.employee.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage {

    private final WebDriver driver;

    public LoginPage(WebDriver driver){
        this.driver = driver;
    }

    private final By adminTab =
            By.xpath("//button[contains(text(),'Administrator')]");

    private final By employeeTab =
            By.xpath("//button[contains(text(),'Employee')]");

    private final By employeeName =
            By.xpath("//input[@placeholder='e.g. Arul Selvam or EMP-1001']");

    private final By adminLogin =
            By.xpath("//button[contains(.,'Sign In as Admin')]");

    private final By employeeLogin =
            By.xpath("//button[contains(.,'Sign In as Employee')]");

    public void loginAsAdmin(){

        driver.findElement(adminTab).click();
        driver.findElement(adminLogin).click();

    }

    public void loginAsEmployee(String name){

        driver.findElement(employeeTab).click();
        driver.findElement(employeeName).sendKeys(name);
        driver.findElement(employeeLogin).click();

    }

}
