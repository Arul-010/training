package com.employee.automation.pages;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Page Object for the Employee Self-Service Portal page (/portal).
 *
 * <p>The portal has several sub-tabs (Dashboard, Users, Projects, Team,
 * Tasks, Application) and two modal forms (Apply Leave, Submit Query).
 * It also exposes profile editing and, on the Projects/Tasks tabs,
 * chat messaging and task-progress update actions.</p>
 */
public class EmployeePortalPage extends BasePage {

    // ── @FindBy — Sub-Tab Navigation ──────────────────────────────────────────

    @FindBy(xpath = "//a[contains(@href,'/portal') and not(contains(@href,'tab'))]")
    private WebElement dashboardTabLink;

    @FindBy(xpath = "//a[contains(@href,'tab=users')]")
    private WebElement usersTabLink;

    @FindBy(xpath = "//a[contains(@href,'tab=projects')]")
    private WebElement projectsTabLink;

    @FindBy(xpath = "//a[contains(@href,'tab=team')]")
    private WebElement teamTabLink;

    @FindBy(xpath = "//a[contains(@href,'tab=tasks')]")
    private WebElement tasksTabLink;

    @FindBy(xpath = "//a[contains(@href,'tab=application')]")
    private WebElement applicationTabLink;

    // ── @FindBy — New Entry Modal Trigger ─────────────────────────────────────

    @FindBy(className = "new-entry-btn")
    private WebElement newEntryBtn;

    // ── @FindBy — Modal Tab Switchers ─────────────────────────────────────────

    @FindBy(xpath = "//button[contains(@class,'modal-tab-btn') and contains(.,'Apply Leave')]")
    private WebElement applyLeaveModalTab;

    @FindBy(xpath = "//button[contains(@class,'modal-tab-btn') and contains(.,'Submit Query')]")
    private WebElement submitQueryModalTab;

    // ── @FindBy — Leave Form ───────────────────────────────────────────────────

    @FindBy(xpath = "//label[text()='Start Date']/following-sibling::input")
    private WebElement leaveStartDate;

    @FindBy(xpath = "//label[text()='End Date']/following-sibling::input")
    private WebElement leaveEndDate;

    @FindBy(xpath =
        "//form[@class='modal-interactive-form'" +
        " and .//h4[contains(text(),'Off-Duty')]]//textarea")
    private WebElement leaveReason;

    @FindBy(xpath =
        "//form[@class='modal-interactive-form'" +
        " and .//h4[contains(text(),'Off-Duty')]]//button[@type='submit']")
    private WebElement leaveSubmitBtn;

    // ── @FindBy — Query Form ───────────────────────────────────────────────────

    @FindBy(xpath =
        "//form[@class='modal-interactive-form'" +
        " and .//h4[contains(text(),'Query Ticket')]]//input[@type='text']")
    private WebElement querySubject;

    @FindBy(xpath =
        "//form[@class='modal-interactive-form'" +
        " and .//h4[contains(text(),'Query Ticket')]]//textarea")
    private WebElement queryMessage;

    @FindBy(xpath =
        "//form[@class='modal-interactive-form'" +
        " and .//h4[contains(text(),'Query Ticket')]]//button[@type='submit']")
    private WebElement querySubmitBtn;

    // ── @FindBy — Profile Section ──────────────────────────────────────────────

    @FindBy(className = "edit-profile-btn")
    private WebElement editProfileBtn;

    @FindBy(xpath = "//label[text()='FULL NAME']/following-sibling::input")
    private WebElement editNameInput;

    @FindBy(xpath = "//label[text()='EMAIL ADDRESS']/following-sibling::input")
    private WebElement editEmailInput;

    @FindBy(xpath = "//label[text()='PHONE NUMBER']/following-sibling::input")
    private WebElement editPhoneInput;

    @FindBy(xpath = "//label[text()='DATE OF BIRTH']/following-sibling::input")
    private WebElement editDobInput;

    @FindBy(xpath = "//button[text()='Save Changes']")
    private WebElement saveChangesBtn;

    @FindBy(className = "user-profile-display-name")
    private WebElement profileDisplayName;

    @FindBy(xpath =
        "//div[contains(@class,'info-attribute-row')" +
        " and .//span[text()='Email Address']]/strong")
    private WebElement profileEmail;

    @FindBy(xpath =
        "//div[contains(@class,'info-attribute-row')" +
        " and .//span[text()='Phone Number']]/strong")
    private WebElement profilePhone;

    // ── @FindBy — Chat ─────────────────────────────────────────────────────────

    @FindBy(xpath = "//form[contains(@class,'portal-chat-input-bar')]/input")
    private WebElement chatInput;

    @FindBy(xpath = "//form[contains(@class,'portal-chat-input-bar')]/button[@type='submit']")
    private WebElement chatSendBtn;

    // ── Constructor ────────────────────────────────────────────────────────────

    public EmployeePortalPage(WebDriver driver) {
        super(driver);
    }

    // ── Sub-Tab Navigation ─────────────────────────────────────────────────────

    /** Navigate to the Portal Dashboard sub-tab. */
    public void navigateToDashboard() { jsClick(dashboardTabLink); }

    /** Navigate to the Users sub-tab. */
    public void navigateToUsers() { jsClick(usersTabLink); }

    /** Navigate to the Projects sub-tab. */
    public void navigateToProjects() { jsClick(projectsTabLink); }

    /** Navigate to the Team sub-tab. */
    public void navigateToTeam() { jsClick(teamTabLink); }

    /** Navigate to the Tasks sub-tab. */
    public void navigateToTasks() { jsClick(tasksTabLink); }

    /** Navigate to the My Application sub-tab. */
    public void navigateToApplication() { jsClick(applicationTabLink); }

    // ── Modal Trigger ──────────────────────────────────────────────────────────

    /** Click "New Entry" to open the apply-leave / submit-query modal. */
    public void clickNewEntry() {
        waitForClickable(newEntryBtn).click();
    }

    /** Inside the modal, switch to the "Apply Leave" form tab. */
    public void selectApplyLeaveModalTab() {
        waitForClickable(applyLeaveModalTab).click();
    }

    /** Inside the modal, switch to the "Submit Query" form tab. */
    public void selectSubmitQueryModalTab() {
        waitForClickable(submitQueryModalTab).click();
    }

    // ── Leave Form ─────────────────────────────────────────────────────────────

    /**
     * Fill the Leave application form and submit it.
     *
     * @param startDate ISO date e.g. "2026-08-01"
     * @param endDate   ISO date e.g. "2026-08-05"
     * @param reason    leave reason text
     */
    public void submitLeave(String startDate, String endDate, String reason) {
        jsSetValue(waitForVisible(leaveStartDate), startDate);
        jsSetValue(waitForVisible(leaveEndDate), endDate);

        WebElement reasonEl = waitForVisible(leaveReason);
        reasonEl.clear();
        reasonEl.sendKeys(reason);

        waitForClickable(leaveSubmitBtn).click();
    }

    // ── Query Form ─────────────────────────────────────────────────────────────

    /**
     * Fill the Query Ticket form and submit it.
     *
     * @param subject short ticket subject
     * @param message detailed message body
     */
    public void submitQuery(String subject, String message) {
        WebElement subjEl = waitForVisible(querySubject);
        subjEl.clear();
        subjEl.sendKeys(subject);

        WebElement msgEl = waitForVisible(queryMessage);
        msgEl.clear();
        msgEl.sendKeys(message);

        waitForClickable(querySubmitBtn).click();
    }

    // ── Attendance ─────────────────────────────────────────────────────────────

    /**
     * Click "Active Today" attendance button if it is present on the page.
     * Safe to call even when the button is absent.
     */
    public void confirmAttendance() {
        List<WebElement> btns = driver.findElements(By.className("active-today"));
        if (!btns.isEmpty()) btns.get(0).click();
    }

    // ── Profile Editing ────────────────────────────────────────────────────────

    /** Click the "Edit Profile" button to enter edit mode. */
    public void clickEditProfile() {
        waitForClickable(editProfileBtn).click();
    }

    /**
     * Update the four editable profile fields and save.
     *
     * @param name  new full name
     * @param email new email address
     * @param phone new phone number
     * @param dob   new date of birth as ISO date e.g. "1998-05-15"
     */
    public void updateProfileDetails(String name, String email,
                                     String phone, String dob) {
        WebElement nameEl = waitForVisible(editNameInput);
        nameEl.clear();
        nameEl.sendKeys(name);

        WebElement emailEl = waitForVisible(editEmailInput);
        emailEl.clear();
        emailEl.sendKeys(email);

        WebElement phoneEl = waitForVisible(editPhoneInput);
        phoneEl.clear();
        phoneEl.sendKeys(phone);

        jsSetValue(waitForVisible(editDobInput), dob);

        waitForClickable(saveChangesBtn).click();
    }

    // ── Profile Getters ────────────────────────────────────────────────────────

    /** @return the employee's display name shown on the profile card. */
    public String getProfileDisplayName() {
        return waitForVisible(profileDisplayName).getText();
    }

    /** @return the email shown in the profile info attributes. */
    public String getProfileEmail() {
        return waitForVisible(profileEmail).getText();
    }

    /** @return the phone number shown in the profile info attributes. */
    public String getProfilePhone() {
        return waitForVisible(profilePhone).getText();
    }

    // ── Chat ───────────────────────────────────────────────────────────────────

    /**
     * Type a message in the chat input bar and click Send.
     *
     * @param message message text to send
     */
    public void sendChatMessage(String message) {
        WebElement input = waitForVisible(chatInput);
        scrollIntoView(input);
        input.clear();
        input.sendKeys(message);

        WebElement send = waitForClickable(chatSendBtn);
        scrollIntoView(send);
        send.click();
    }

    /**
     * @return the text of the last chat bubble in the conversation,
     *         or {@code ""} if no messages are present.
     */
    public String getLastChatMessageText() {
        List<WebElement> bubbles =
                driver.findElements(By.className("chat-message-row"));
        if (bubbles.isEmpty()) return "";
        return bubbles.get(bubbles.size() - 1)
                      .findElement(By.className("chat-sender-text"))
                      .getText();
    }

    // ── Task Progress ──────────────────────────────────────────────────────────

    /**
     * Update the progress slider for the task at {@code taskIndex}
     * (0-based, among tasks assigned to the current user) and click Save.
     *
     * @param taskIndex 0-based index in the "assigned to me" task list
     * @param progress  percentage value 0–100
     */
    public void updateTaskProgress(int taskIndex, int progress) {
        List<WebElement> tasks = driver.findElements(
                By.cssSelector(".portal-task-item.assigned-me"));
        if (taskIndex >= tasks.size()) return;

        WebElement task   = tasks.get(taskIndex);
        WebElement slider = task.findElement(By.className("progress-range-slider"));
        scrollIntoView(slider);
        jsSetValue(slider, String.valueOf(progress));

        try { Thread.sleep(1000); } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        WebElement saveBtn = task.findElement(By.className("update-progress-btn"));
        scrollIntoView(saveBtn);
        saveBtn.click();
    }

    /**
     * @param taskIndex 0-based index in the "assigned to me" task list
     * @return the progress percentage label text (e.g. "75%"),
     *         or {@code ""} if the task is not found.
     */
    public String getTaskProgressPercent(int taskIndex) {
        List<WebElement> tasks = driver.findElements(
                By.cssSelector(".portal-task-item.assigned-me"));
        if (taskIndex >= tasks.size()) return "";
        return tasks.get(taskIndex)
                    .findElement(By.className("progress-lbl"))
                    .getText();
    }
}
