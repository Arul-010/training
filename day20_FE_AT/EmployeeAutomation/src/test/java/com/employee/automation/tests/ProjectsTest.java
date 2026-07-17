package com.employee.automation.tests;

import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;
import com.employee.automation.base.BaseTest;
import com.employee.automation.pages.LoginPage;
import com.employee.automation.pages.DashboardPage;
import com.employee.automation.pages.ProjectsPage;

public class ProjectsTest extends BaseTest {

    @Test
    public void testProjectLifecycle() throws InterruptedException {
        // Navigate to login page fresh
        navigateToLogin();

        // Step 1: Login as Admin
        LoginPage loginPage = new LoginPage(driver);
        loginPage.loginAsAdmin();
        Thread.sleep(3000);

        // Step 2: Navigate to Projects
        DashboardPage dashboardPage = new DashboardPage(driver);
        dashboardPage.navigateToProjects();
        Thread.sleep(3000);

        ProjectsPage projectsPage = new ProjectsPage(driver);

        // Step 3: Create Project
        projectsPage.clickCreateProject();
        Thread.sleep(3000);

        projectsPage.fillProjectDetails("Test Automation Project",
                "Project to automate the testing suite.", "Active Progress", "2026-12-31");
        projectsPage.assignMember("Neil Rice");
        projectsPage.clickSubmitDrawer();
        Thread.sleep(3000);

        // Step 4: Verify Project Created
        WebElement card = projectsPage.getProjectCard("Test Automation Project");
        Assert.assertNotNull(card, "Project 'Test Automation Project' should be created");

        // Step 5: Edit Project Details
        projectsPage.clickEditProject("Test Automation Project");
        Thread.sleep(3000);

        projectsPage.fillProjectDetails("Test Automation Project",
                "Project to automate the testing suite.", "Inactive / On Hold", "2026-12-31");
        projectsPage.clickSubmitDrawer();
        Thread.sleep(3000);

        // Step 6: Delete Project
        projectsPage.clickDeleteProject("Test Automation Project");
        Thread.sleep(3000);

        // Verify project is deleted
        WebElement deletedCard = projectsPage.getProjectCard("Test Automation Project");
        Assert.assertNull(deletedCard, "Project 'Test Automation Project' should be deleted");
    }
}
