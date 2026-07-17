package com.employee.automation.tests;

import org.testng.Assert;
import org.testng.annotations.Test;
import com.employee.automation.base.BaseTest;
import com.employee.automation.pages.LoginPage;
import com.employee.automation.pages.DashboardPage;

public class DashboardTest extends BaseTest {

    @Test
    public void testAdminDashboard() throws InterruptedException {
        // Navigate to login page fresh
        navigateToLogin();

        // Step 1: Login as Admin
        LoginPage loginPage = new LoginPage(driver);
        loginPage.loginAsAdmin();
        Thread.sleep(3000);

        // Step 2: Initialize Dashboard Page
        DashboardPage dashboardPage = new DashboardPage(driver);

        // Verify that metrics are displayed
        String totalEmployees = dashboardPage.getTotalEmployees();
        String openPositions = dashboardPage.getOpenPositions();
        String leaveRequests = dashboardPage.getLeaveRequests();
        String lateInflows = dashboardPage.getLateInflows();

        Assert.assertNotNull(totalEmployees, "Total Employees metric should not be null");
        Assert.assertNotNull(openPositions, "Open Positions metric should not be null");
        Assert.assertNotNull(leaveRequests, "Leave Requests metric should not be null");
        Assert.assertNotNull(lateInflows, "Late Inflows metric should not be null");

        System.out.println("Dashboard Metrics: " + totalEmployees + " Employees, " +
                openPositions + " Open Positions, " + leaveRequests + " Leave Requests, " +
                lateInflows + " Late Inflows.");

        // Step 3: Change timeframe dropdown
        dashboardPage.selectTimeframe("Today");
        Thread.sleep(3000);
        dashboardPage.selectTimeframe("Last Week");
        Thread.sleep(3000);
        dashboardPage.selectTimeframe("Last 30 Days");
        Thread.sleep(3000);

        // Step 4: Test navigation to Employees and back to Dashboard
        dashboardPage.navigateToEmployees();
        Thread.sleep(3000);
        Assert.assertTrue(driver.getCurrentUrl().contains("/employees"), "Should navigate to /employees");

        dashboardPage.navigateToDashboard();
        Thread.sleep(3000);
        Assert.assertTrue(driver.getCurrentUrl().contains("/dashboard"), "Should navigate to /dashboard");
    }
}
