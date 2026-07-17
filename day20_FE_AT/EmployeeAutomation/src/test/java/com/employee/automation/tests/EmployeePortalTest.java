package com.employee.automation.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.employee.automation.base.BaseTest;
import com.employee.automation.pages.LoginPage;
import com.employee.automation.pages.EmployeePortalPage;

public class EmployeePortalTest extends BaseTest {

    @Test
    public void testEmployeePortalActions() throws InterruptedException {
        // Navigate to login page fresh
        navigateToLogin();

        // Step 1: Login as Employee
        LoginPage loginPage = new LoginPage(driver);
        loginPage.loginAsEmployee("Arul Selvam");
        Thread.sleep(3000);

        EmployeePortalPage portalPage = new EmployeePortalPage(driver);

        // Confirm daily attendance if prompt is present
        portalPage.confirmAttendance();
        Thread.sleep(3000);

        // Step 2: Navigate to Users Tab (Corporate Info) and test Edit Profile
        portalPage.navigateToUsers();
        Thread.sleep(3000);
        
        portalPage.clickEditProfile();
        Thread.sleep(2000);
        
        String newName = "Arul Selvam Updated";
        String newEmail = "arul.updated@example.com";
        String newPhone = "+91 99999 88888";
        portalPage.updateProfileDetails(newName, newEmail, newPhone, "1995-05-15");
        Thread.sleep(3000);
        
        Assert.assertEquals(portalPage.getProfileDisplayName(), newName, "Profile name should be updated");
        Assert.assertEquals(portalPage.getProfileEmail(), newEmail, "Profile email should be updated");
        Assert.assertEquals(portalPage.getProfilePhone(), newPhone, "Profile phone should be updated");

        // Step 3: Navigate to Projects Tab and test Chat & Progress Updates
        portalPage.navigateToProjects();
        Thread.sleep(3000);
        
        // Send a chat message
        String chatMsg = "Testing team chat functionality: Hello team!";
        portalPage.sendChatMessage(chatMsg);
        Thread.sleep(2000);
        Assert.assertEquals(portalPage.getLastChatMessageText(), chatMsg, "Sent chat message should match last chat message");

        // Update task progress
        portalPage.updateTaskProgress(0, 95);
        Thread.sleep(3000);
        Assert.assertTrue(portalPage.getTaskProgressPercent(0).contains("95%"), "Task progress should be updated to 95%");

        // Step 4: Navigate to Application Tab
        portalPage.navigateToApplication();
        Thread.sleep(3000);

        // Step 5: Apply Leave
        portalPage.clickNewEntry();
        Thread.sleep(3000);

        portalPage.selectApplyLeaveModalTab();
        Thread.sleep(3000);

        // Dates for tomorrow and day after (YYYY-MM-DD format for HTML5 input)
        portalPage.submitLeave("2026-07-20", "2026-07-22", "Family vacation request.");
        Thread.sleep(3000);

        // Step 6: Submit Query
        portalPage.clickNewEntry();
        Thread.sleep(3000);

        portalPage.selectSubmitQueryModalTab();
        Thread.sleep(3000);

        portalPage.submitQuery("Need New Keyboard", "My mechanical keyboard is malfunctioned. Requesting a replacement.");
        Thread.sleep(3000);
    }
}
