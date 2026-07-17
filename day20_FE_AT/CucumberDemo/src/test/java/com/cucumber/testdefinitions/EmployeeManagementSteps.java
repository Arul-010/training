package com.cucumber.testdefinitions;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.junit.Assert;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;

import com.employee.automation.pages.*;

public class EmployeeManagementSteps {

    WebDriver driver;
    LoginPage loginPage;
    DashboardPage dashboardPage;
    EmployeeListPage employeeListPage;
    EmployeeFormPage employeeFormPage;
    EmployeeDetailsPage employeeDetailsPage;
    ProjectsPage projectsPage;
    QueriesPage queriesPage;
    EmployeePortalPage employeePortalPage;

    String uniqueName;
    String uniqueEmail;
    String johnId;

    @Given("User is on the login page")
    public void user_is_on_the_login_page() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("http://localhost:5173/login");
        loginPage = new LoginPage(driver);
        
        // Keep sidebar collapsed by default on load
        try {
            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("localStorage.setItem('ems_sidebar_pinned', 'false');");
            driver.navigate().refresh();
            Thread.sleep(1500);
        } catch (Exception ignored) {}
    }

    @When("User logs in as Admin")
    public void user_logs_in_as_admin() throws InterruptedException {
        loginPage.loginAsAdmin();
        Thread.sleep(3000);
        dashboardPage = new DashboardPage(driver);
    }

    @Then("Dashboard metrics for total employees, open positions, leave requests, and late inflows should be visible")
    public void dashboard_metrics_should_be_visible() {
        String totalEmployees = dashboardPage.getTotalEmployees();
        String openPositions = dashboardPage.getOpenPositions();
        String leaveRequests = dashboardPage.getLeaveRequests();
        String lateInflows = dashboardPage.getLateInflows();

        Assert.assertNotNull(totalEmployees);
        Assert.assertNotNull(openPositions);
        Assert.assertNotNull(leaveRequests);
        Assert.assertNotNull(lateInflows);
    }

    @When("User selects timeframe {string}")
    public void user_selects_timeframe(String timeframe) throws InterruptedException {
        dashboardPage.selectTimeframe(timeframe);
        Thread.sleep(2000);
    }

    @When("User navigates to Employees Roster page")
    public void user_navigates_to_employees_roster_page() throws InterruptedException {
        dashboardPage.navigateToEmployees();
        Thread.sleep(3000);
        employeeListPage = new EmployeeListPage(driver);
    }

    @Then("Current URL should contain {string}")
    public void current_url_should_contain(String urlSubstring) {
        Assert.assertTrue(driver.getCurrentUrl().contains(urlSubstring));
    }

    @When("User navigates back to Dashboard page")
    public void user_navigates_back_to_dashboard_page() throws InterruptedException {
        dashboardPage.navigateToDashboard();
        Thread.sleep(3000);
    }

    @When("User signs out")
    public void user_signs_out() throws InterruptedException {
        dashboardPage.signOut();
        Thread.sleep(2000);
        driver.quit();
    }

    @When("User searches for employee {string}")
    public void user_searches_for_employee(String name) throws InterruptedException {
        employeeListPage.enterSearchText(name);
        Thread.sleep(3000);
    }

    @Then("Employee row for {string} should be visible")
    public void employee_row_should_be_visible(String name) {
        WebElement row = employeeListPage.getEmployeeRowByName(name);
        Assert.assertNotNull(row);
    }

    @When("User clears the search filter")
    public void user_clears_the_search_filter() throws InterruptedException {
        employeeListPage.enterSearchText("");
        Thread.sleep(2000);
    }

    @When("User clicks the Add Employee button")
    public void user_clicks_the_add_employee_button() throws InterruptedException {
        employeeListPage.clickAddEmployee();
        Thread.sleep(3000);
        employeeFormPage = new EmployeeFormPage(driver);
    }

    @When("User submits the employee form with unique details")
    public void user_submits_the_employee_form_with_unique_details() throws InterruptedException {
        uniqueName = "John Doe Test " + System.currentTimeMillis();
        uniqueEmail = "john.doe.test" + System.currentTimeMillis() + "@company.com";

        employeeFormPage.enterFullName(uniqueName);
        employeeFormPage.enterEmail(uniqueEmail);
        employeeFormPage.enterPhone("+1 (555) 123-4567");
        employeeFormPage.selectDepartment("Engineering");
        employeeFormPage.enterRole("Software Engineer");
        employeeFormPage.enterSalary("120000");
        employeeFormPage.enterJoinDate("2026-07-01");
        employeeFormPage.enterDob("1998-05-15");
        employeeFormPage.clickSubmit();
        Thread.sleep(3000);
    }

    @Then("The new employee should be found in search results")
    public void the_new_employee_should_be_found_in_search_results() throws InterruptedException {
        employeeListPage.enterSearchText(uniqueName);
        Thread.sleep(3000);
        WebElement johnRow = null;
        for (int i = 0; i < 10; i++) {
            johnRow = employeeListPage.getEmployeeRowByName(uniqueName);
            if (johnRow != null) break;
            Thread.sleep(3000);
        }
        Assert.assertNotNull(johnRow);
        johnId = johnRow.findElement(By.className("roster-id")).getText();
    }

    @When("User views details of the new employee")
    public void user_views_details_of_the_new_employee() throws InterruptedException {
        employeeListPage.clickViewDetails(johnId);
        Thread.sleep(3000);
        employeeDetailsPage = new EmployeeDetailsPage(driver);
    }

    @Then("Employee details should match the submitted details")
    public void employee_details_should_match_the_submitted_details() {
        Assert.assertEquals(employeeDetailsPage.getFullName(), uniqueName);
        Assert.assertEquals(employeeDetailsPage.getEmail(), uniqueEmail);
    }

    @When("User edits employee details to status {string} and salary {string}")
    public void user_edits_employee_details(String status, String salary) throws InterruptedException {
        employeeDetailsPage.clickEditDetails();
        Thread.sleep(3000);
        employeeFormPage.selectStatus(status);
        employeeFormPage.enterSalary(salary);
        employeeFormPage.clickSubmit();
        Thread.sleep(3000);
    }

    @Then("Employee status and salary should be updated to {string} and {string}")
    public void employee_status_and_salary_should_be_updated(String status, String salary) throws InterruptedException {
        boolean isUpdated = false;
        for (int i = 0; i < 10; i++) {
            try {
                driver.navigate().refresh();
                Thread.sleep(3000);
                String currentStatus = employeeDetailsPage.getStatus();
                String currentSalary = employeeDetailsPage.getSalary();
                String cleanCurrentSalary = currentSalary.replaceAll("[^0-9]", "");
                String cleanSalary = salary.replaceAll("[^0-9]", "");
                if (currentStatus.equalsIgnoreCase(status) && cleanCurrentSalary.contains(cleanSalary)) {
                    isUpdated = true;
                    break;
                }
            } catch (Exception ignored) {}
        }
        Assert.assertTrue(isUpdated);
    }

    @When("User deletes the new employee profile")
    public void user_deletes_the_new_employee_profile() throws InterruptedException {
        employeeDetailsPage.clickDeleteProfile();
        Thread.sleep(3000);
        employeeListPage.confirmDeletion();
        Thread.sleep(5000);
    }

    @Then("The deleted employee should not be found in the roster")
    public void the_deleted_employee_should_not_be_found_in_the_roster() throws InterruptedException {
        employeeListPage.enterSearchText(uniqueName);
        Thread.sleep(3000);
        WebElement deletedRow = employeeListPage.getEmployeeRowByName(uniqueName);
        Assert.assertNull(deletedRow);
    }

    @When("User navigates to Projects page")
    public void user_navigates_to_projects_page() throws InterruptedException {
        dashboardPage.navigateToProjects();
        Thread.sleep(3000);
        projectsPage = new ProjectsPage(driver);
    }

    @When("User clicks the Create Project button")
    public void user_clicks_the_create_project_button() throws InterruptedException {
        projectsPage.clickCreateProject();
        Thread.sleep(3000);
    }

    @When("User submits project details with name {string}, description {string}, status {string}, and deadline {string} assigning member {string}")
    public void user_submits_project_details(String name, String desc, String status, String deadline, String member) throws InterruptedException {
        projectsPage.fillProjectDetails(name, desc, status, deadline);
        projectsPage.assignMember(member);
        projectsPage.clickSubmitDrawer();
        Thread.sleep(3000);
    }

    @Then("Project {string} card should be visible")
    public void project_card_should_be_visible(String name) {
        WebElement card = projectsPage.getProjectCard(name);
        Assert.assertNotNull(card);
    }

    @When("User edits details of project {string} to status {string}")
    public void user_edits_details_of_project(String name, String status) throws InterruptedException {
        projectsPage.clickEditProject(name);
        Thread.sleep(3000);
        projectsPage.fillProjectDetails(name, "Project to automate the testing suite.", status, "2026-12-31");
        projectsPage.clickSubmitDrawer();
        Thread.sleep(3000);
    }

    @When("User deletes project {string}")
    public void user_deletes_project(String name) throws InterruptedException {
        projectsPage.clickDeleteProject(name);
        Thread.sleep(3000);
    }

    @Then("Project {string} card should not be visible")
    public void project_card_should_not_be_visible(String name) {
        WebElement card = projectsPage.getProjectCard(name);
        Assert.assertNull(card);
    }

    @When("User navigates to Helpdesk page")
    public void user_navigates_to_helpdesk_page() throws InterruptedException {
        dashboardPage.navigateToHelpdesk();
        Thread.sleep(3000);
        queriesPage = new QueriesPage(driver);
    }

    @When("User resolves query {string}")
    public void user_resolves_query(String subject) throws InterruptedException {
        queriesPage.resolveQuery(subject);
        Thread.sleep(3000);
    }

    @When("User navigates to Leave Applications tab")
    public void user_navigates_to_leave_applications_tab() throws InterruptedException {
        queriesPage.clickLeaveTab();
        Thread.sleep(3000);
    }

    @When("User adjusts leave grant days for {string} to {int}")
    public void user_adjusts_leave_grant_days(String empName, Integer days) throws InterruptedException {
        queriesPage.adjustGrantDays(empName, days);
        Thread.sleep(3000);
    }

    @When("User approves leave request for {string}")
    public void user_approves_leave_request(String empName) throws InterruptedException {
        queriesPage.approveLeave(empName);
        Thread.sleep(3000);
    }

    @Then("Leave status for {string} should contain {string}")
    public void leave_status_should_contain(String empName, String expectedStatus) {
        Assert.assertTrue(queriesPage.getLeaveStatus(empName).contains(expectedStatus));
    }

    @When("User rejects leave request for {string}")
    public void user_rejects_leave_request(String empName) throws InterruptedException {
        queriesPage.rejectLeave(empName);
        Thread.sleep(3000);
    }

    @When("User logs in as Employee {string}")
    public void user_logs_in_as_employee(String name) throws InterruptedException {
        loginPage.loginAsEmployee(name);
        Thread.sleep(3000);
        employeePortalPage = new EmployeePortalPage(driver);
    }

    @When("User confirms attendance if prompted")
    public void user_confirms_attendance_if_prompted() throws InterruptedException {
        employeePortalPage.confirmAttendance();
        Thread.sleep(3000);
    }

    @When("User navigates to Users tab in portal")
    public void user_navigates_to_users_tab_in_portal() throws InterruptedException {
        employeePortalPage.navigateToUsers();
        Thread.sleep(3000);
    }

    @When("User clicks edit profile and updates details with name {string}, email {string}, and phone {string}")
    public void user_clicks_edit_profile_and_updates_details(String name, String email, String phone) throws InterruptedException {
        employeePortalPage.clickEditProfile();
        Thread.sleep(2000);
        employeePortalPage.updateProfileDetails(name, email, phone, "1995-05-15");
        Thread.sleep(3000);
    }

    @Then("Profile display name, email, and phone should be updated to match")
    public void profile_display_name_email_and_phone_should_be_updated() {
        Assert.assertEquals(employeePortalPage.getProfileDisplayName(), "Arul Selvam Updated");
        Assert.assertEquals(employeePortalPage.getProfileEmail(), "arul.updated@example.com");
        Assert.assertEquals(employeePortalPage.getProfilePhone(), "+91 99999 88888");
    }

    @When("User navigates to Projects tab in portal")
    public void user_navigates_to_projects_tab_in_portal() throws InterruptedException {
        employeePortalPage.navigateToProjects();
        Thread.sleep(3000);
    }

    @When("User sends chat message {string}")
    public void user_sends_chat_message(String message) throws InterruptedException {
        employeePortalPage.sendChatMessage(message);
        Thread.sleep(2000);
    }

    @Then("The last sent chat message should display {string}")
    public void the_last_sent_chat_message_should_display(String expectedMessage) {
        Assert.assertEquals(employeePortalPage.getLastChatMessageText(), expectedMessage);
    }

    @When("User updates progress for task {int} to {int} percent")
    public void user_updates_progress_for_task(Integer taskIndex, Integer progress) throws InterruptedException {
        employeePortalPage.updateTaskProgress(taskIndex, progress);
        Thread.sleep(3000);
    }

    @Then("Task {int} progress should contain {string}")
    public void task_progress_should_contain(Integer taskIndex, String progressPercent) {
        Assert.assertTrue(employeePortalPage.getTaskProgressPercent(taskIndex).contains(progressPercent));
    }

    @When("User navigates to Application tab in portal")
    public void user_navigates_to_application_tab_in_portal() throws InterruptedException {
        employeePortalPage.navigateToApplication();
        Thread.sleep(3000);
    }

    @When("User clicks New Entry button")
    public void user_clicks_new_entry_button() throws InterruptedException {
        employeePortalPage.clickNewEntry();
        Thread.sleep(3000);
    }

    @When("User selects Apply Leave modal tab")
    public void user_selects_apply_leave_modal_tab() throws InterruptedException {
        employeePortalPage.selectApplyLeaveModalTab();
        Thread.sleep(3000);
    }

    @When("User submits leave application from {string} to {string} with reason {string}")
    public void user_submits_leave_application(String start, String end, String reason) throws InterruptedException {
        employeePortalPage.submitLeave(start, end, reason);
        Thread.sleep(3000);
    }

    @When("User clicks New Entry button again")
    public void user_clicks_new_entry_button_again() throws InterruptedException {
        employeePortalPage.clickNewEntry();
        Thread.sleep(3000);
    }

    @When("User selects Submit Query modal tab")
    public void user_selects_submit_query_modal_tab() throws InterruptedException {
        employeePortalPage.selectSubmitQueryModalTab();
        Thread.sleep(3000);
    }

    @When("User submits query with subject {string} and message {string}")
    public void user_submits_query(String subject, String message) throws InterruptedException {
        employeePortalPage.submitQuery(subject, message);
        Thread.sleep(3000);
    }

    @Then("Browser should close")
    public void browser_should_close() {
        if (driver != null) {
            driver.quit();
        }
    }
}
