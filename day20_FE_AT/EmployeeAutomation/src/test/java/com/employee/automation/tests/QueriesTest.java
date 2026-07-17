package com.employee.automation.tests;

import org.testng.Assert;
import org.testng.annotations.Test;
import com.employee.automation.base.BaseTest;
import com.employee.automation.pages.LoginPage;
import com.employee.automation.pages.DashboardPage;
import com.employee.automation.pages.QueriesPage;

public class QueriesTest extends BaseTest {

    @Test
    public void testManageQueriesAndLeaves() throws InterruptedException {
        // Navigate to login page fresh
        navigateToLogin();

        // Step 1: Login as Admin
        LoginPage loginPage = new LoginPage(driver);
        loginPage.loginAsAdmin();
        Thread.sleep(3000);

        // Step 2: Navigate to Helpdesk
        DashboardPage dashboardPage = new DashboardPage(driver);
        dashboardPage.navigateToHelpdesk();
        Thread.sleep(3000);

        QueriesPage queriesPage = new QueriesPage(driver);

        // Step 3: Resolve a Helpdesk Query
        queriesPage.resolveQuery("Leave Approval Request");
        Thread.sleep(3000);

        // Step 4: Click Leave Tab and Approve/Reject Leave Application
        queriesPage.clickLeaveTab();
        Thread.sleep(3000);

        // Adjust grant days and approve Sarah Jenkins
        queriesPage.adjustGrantDays("Sarah Jenkins", 2);
        Thread.sleep(3000);
        queriesPage.approveLeave("Sarah Jenkins");
        Thread.sleep(3000);
        Assert.assertTrue(queriesPage.getLeaveStatus("Sarah Jenkins").contains("Approved"), "Leave request for Sarah Jenkins should be Approved");

        // Reject Michael Chen
        queriesPage.rejectLeave("Michael Chen");
        Thread.sleep(3000);
        Assert.assertTrue(queriesPage.getLeaveStatus("Michael Chen").contains("Rejected"), "Leave request for Michael Chen should be Rejected");
    }
}
