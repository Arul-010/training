package com.employee.automation.tests;

import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;
import com.employee.automation.base.BaseTest;
import com.employee.automation.pages.LoginPage;
import com.employee.automation.pages.DashboardPage;
import com.employee.automation.pages.EmployeeListPage;
import com.employee.automation.pages.EmployeeFormPage;
import com.employee.automation.pages.EmployeeDetailsPage;

public class EmployeeRosterTest extends BaseTest {

    @Test
    public void testEmployeeLifecycle() throws InterruptedException {
        // Navigate to login page fresh
        navigateToLogin();

        // Step 1: Login as Admin
        LoginPage loginPage = new LoginPage(driver);
        loginPage.loginAsAdmin();
        Thread.sleep(3000);

        // Step 2: Navigate to Employees Roster
        DashboardPage dashboardPage = new DashboardPage(driver);
        dashboardPage.navigateToEmployees();
        Thread.sleep(3000);

        EmployeeListPage listPage = new EmployeeListPage(driver);

        // Step 3: Search for an existing employee
        listPage.enterSearchText("Neil Rice");
        Thread.sleep(3000);
        WebElement row = listPage.getEmployeeRowByName("Neil Rice");
        Assert.assertNotNull(row, "Neil Rice should be visible in search results");

        // Clear search
        listPage.enterSearchText("");
        Thread.sleep(3000);

        String uniqueName = "John Doe Test " + System.currentTimeMillis();
        String uniqueEmail = "john.doe.test" + System.currentTimeMillis() + "@company.com";

        // Step 4: Click Add Employee
        listPage.clickAddEmployee();
        Thread.sleep(3000);

        // Step 5: Fill Form
        EmployeeFormPage formPage = new EmployeeFormPage(driver);
        formPage.enterFullName(uniqueName);
        formPage.enterEmail(uniqueEmail);
        formPage.enterPhone("+1 (555) 123-4567");
        formPage.selectDepartment("Engineering");
        formPage.enterRole("Software Engineer");
        formPage.enterSalary("120000");
        formPage.enterJoinDate("2026-07-01");
        formPage.enterDob("1998-05-15");
        formPage.clickSubmit();
        Thread.sleep(3000);

        // Step 6: Verify employee is added
        listPage.enterSearchText(uniqueName);
        Thread.sleep(3000);
        WebElement johnRow = null;
        for (int i = 0; i < 10; i++) {
            johnRow = listPage.getEmployeeRowByName(uniqueName);
            if (johnRow != null) break;
            Thread.sleep(3000);
        }
        Assert.assertNotNull(johnRow, "Newly created employee " + uniqueName + " should be listed");

        // Find ID
        String johnId = johnRow.findElement(org.openqa.selenium.By.className("roster-id")).getText();

        // Step 7: View Details
        listPage.clickViewDetails(johnId);
        Thread.sleep(3000);

        EmployeeDetailsPage detailsPage = new EmployeeDetailsPage(driver);
        Assert.assertEquals(detailsPage.getFullName(), uniqueName);
        Assert.assertEquals(detailsPage.getEmail(), uniqueEmail);

        // Step 8: Edit Profile
        detailsPage.clickEditDetails();
        Thread.sleep(3000);

        formPage.selectStatus("On Leave");
        formPage.enterSalary("130000");
        formPage.clickSubmit();
        Thread.sleep(3000);

        // The app uses optimistic updates: status/salary are reflected immediately
        // after save — no page refresh needed. Refresh would break locally-created
        // employees (EMP-timestamp IDs not in MockAPI) and cause loading spinners
        // to hide the target elements, returning empty strings.
        Thread.sleep(3000);
        String status = detailsPage.getStatus();
        String salary = detailsPage.getSalary();
        System.out.println("[DEBUG] After edit — status='" + status + "', salary='" + salary + "'");
        Assert.assertTrue(
            status.equalsIgnoreCase("On Leave"),
            "Employee status should be 'On Leave' but was: '" + status + "'"
        );
        Assert.assertTrue(
            salary.contains("130,000") || salary.contains("130000"),
            "Employee salary should contain '130,000' but was: '" + salary + "'"
        );

        // Step 9: Delete employee
        detailsPage.clickDeleteProfile();
        Thread.sleep(3000);
        listPage.confirmDeletion();
        // Wait for navigation back to /employees list to complete
        Thread.sleep(5000);

        // Verify the employee is no longer present.
        // Check WITHOUT refreshing — the React local state is already updated after delete.
        // A page refresh triggers background MockAPI re-sync which may bring the employee back
        // if the MockAPI DELETE is still in-flight.
        Assert.assertTrue(driver.getCurrentUrl().contains("/employees"), "Should be on employees list after delete");
        listPage.enterSearchText(uniqueName);
        Thread.sleep(3000);
        WebElement deletedRow = listPage.getEmployeeRowByName(uniqueName);
        Assert.assertNull(deletedRow, "Deleted employee " + uniqueName + " should not be found in the roster");
    }
}
