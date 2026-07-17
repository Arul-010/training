Feature: Employee Management System Verification

  Scenario: Admin Dashboard Verification
    Given User is on the login page
    When User logs in as Admin
    Then Dashboard metrics for total employees, open positions, leave requests, and late inflows should be visible
    When User selects timeframe "Today"
    And User selects timeframe "Last Week"
    And User selects timeframe "Last 30 Days"
    And User navigates to Employees Roster page
    Then Current URL should contain "/employees"
    When User navigates back to Dashboard page
    Then Current URL should contain "/dashboard"
    And User signs out

  Scenario: Employee Lifecycle (Roster CRUD)
    Given User is on the login page
    When User logs in as Admin
    And User navigates to Employees Roster page
    And User searches for employee "Neil Rice"
    Then Employee row for "Neil Rice" should be visible
    When User clears the search filter
    And User clicks the Add Employee button
    And User submits the employee form with unique details
    Then The new employee should be found in search results
    When User views details of the new employee
    Then Employee details should match the submitted details
    When User edits employee details to status "On Leave" and salary "130000"
    Then Employee status and salary should be updated to "On Leave" and "130000"
    When User deletes the new employee profile
    Then The deleted employee should not be found in the roster
    And User signs out

  Scenario: Project Lifecycle
    Given User is on the login page
    When User logs in as Admin
    And User navigates to Projects page
    And User clicks the Create Project button
    And User submits project details with name "Test Automation Project", description "Project to automate the testing suite.", status "Active Progress", and deadline "2026-12-31" assigning member "Neil Rice"
    Then Project "Test Automation Project" card should be visible
    When User edits details of project "Test Automation Project" to status "Inactive / On Hold"
    And User deletes project "Test Automation Project"
    Then Project "Test Automation Project" card should not be visible
    And User signs out

  Scenario: Manage Queries and Leaves
    Given User is on the login page
    When User logs in as Admin
    And User navigates to Helpdesk page
    And User resolves query "Leave Approval Request"
    And User navigates to Leave Applications tab
    And User adjusts leave grant days for "Sarah Jenkins" to 2
    And User approves leave request for "Sarah Jenkins"
    Then Leave status for "Sarah Jenkins" should contain "Approved"
    When User rejects leave request for "Michael Chen"
    Then Leave status for "Michael Chen" should contain "Rejected"
    And User signs out

  Scenario: Employee Portal Actions
    Given User is on the login page
    When User logs in as Employee "Arul Selvam"
    And User confirms attendance if prompted
    And User navigates to Users tab in portal
    And User clicks edit profile and updates details with name "Arul Selvam Updated", email "arul.updated@example.com", and phone "+91 99999 88888"
    Then Profile display name, email, and phone should be updated to match
    When User navigates to Projects tab in portal
    And User sends chat message "Testing team chat functionality: Hello team!"
    Then The last sent chat message should display "Testing team chat functionality: Hello team!"
    When User updates progress for task 0 to 95 percent
    Then Task 0 progress should contain "95%"
    When User navigates to Application tab in portal
    And User clicks New Entry button
    And User selects Apply Leave modal tab
    And User submits leave application from "2026-07-20" to "2026-07-22" with reason "Family vacation request."
    When User clicks New Entry button again
    And User selects Submit Query modal tab
    And User submits query with subject "Need New Keyboard" and message "My mechanical keyboard is malfunctioned. Requesting a replacement."
    Then Browser should close
