package com.employee.automation.tests;

import org.testng.annotations.Test;

import com.employee.automation.base.BaseTest;
import com.employee.automation.pages.LoginPage;

public class LoginTest extends BaseTest {

    @Test
    public void adminLogin() {
        navigateToLogin();
        LoginPage login = new LoginPage(driver);
        login.loginAsAdmin();
    }

    @Test
    public void employeeLogin() {
        navigateToLogin();
        LoginPage login = new LoginPage(driver);
        login.loginAsEmployee("Arul Selvam");
    }

}