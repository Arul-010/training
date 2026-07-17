package com.employee.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class EmployeePortalPage {

    private final WebDriver driver;

    public EmployeePortalPage(WebDriver driver) {
        this.driver = driver;
    }

    private WebElement waitForElement(By locator) {
        return new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    // Tab links
    private final By dashboardTabLink = By.xpath("//a[contains(@href, '/portal') and not(contains(@href, 'tab'))]");
    private final By usersTabLink = By.xpath("//a[contains(@href, 'tab=users')]");
    private final By projectsTabLink = By.xpath("//a[contains(@href, 'tab=projects')]");
    private final By teamTabLink = By.xpath("//a[contains(@href, 'tab=team')]");
    private final By tasksTabLink = By.xpath("//a[contains(@href, 'tab=tasks')]");
    private final By applicationTabLink = By.xpath("//a[contains(@href, 'tab=application')]");

    // NEW ENTRY triggers
    private final By newEntryBtn = By.className("new-entry-btn");

    // Modal switch buttons
    private final By applyLeaveModalTab = By.xpath("//button[contains(@class, 'modal-tab-btn') and contains(., 'Apply Leave')]");
    private final By submitQueryModalTab = By.xpath("//button[contains(@class, 'modal-tab-btn') and contains(., 'Submit Query')]");

    // Leave form fields
    private final By leaveStartDate = By.xpath("//label[text()='Start Date']/following-sibling::input");
    private final By leaveEndDate = By.xpath("//label[text()='End Date']/following-sibling::input");
    private final By leaveReason = By.xpath("//form[@class='modal-interactive-form' and .//h4[contains(text(), 'Off-Duty')]]//textarea");
    private final By leaveSubmitBtn = By.xpath("//form[@class='modal-interactive-form' and .//h4[contains(text(), 'Off-Duty')]]//button[@type='submit']");

    // Query form fields
    private final By querySubject = By.xpath("//form[@class='modal-interactive-form' and .//h4[contains(text(), 'Query Ticket')]]//input[@type='text']");
    private final By queryMessage = By.xpath("//form[@class='modal-interactive-form' and .//h4[contains(text(), 'Query Ticket')]]//textarea");
    private final By querySubmitBtn = By.xpath("//form[@class='modal-interactive-form' and .//h4[contains(text(), 'Query Ticket')]]//button[@type='submit']");

    public void navigateToDashboard() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(dashboardTabLink));
    }

    public void navigateToUsers() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(usersTabLink));
    }

    public void navigateToProjects() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(projectsTabLink));
    }

    public void navigateToTeam() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(teamTabLink));
    }

    public void navigateToTasks() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(tasksTabLink));
    }

    public void navigateToApplication() {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", driver.findElement(applicationTabLink));
    }

    public void clickNewEntry() {
        waitForElement(newEntryBtn).click();
    }

    public void selectApplyLeaveModalTab() {
        waitForElement(applyLeaveModalTab).click();
    }

    public void selectSubmitQueryModalTab() {
        waitForElement(submitQueryModalTab).click();
    }

    public void submitLeave(String startDate, String endDate, String reason) {
        WebElement startInput = waitForElement(leaveStartDate);
        startInput.clear();
        startInput.sendKeys(startDate);

        WebElement endInput = waitForElement(leaveEndDate);
        endInput.clear();
        endInput.sendKeys(endDate);

        WebElement reasonInput = waitForElement(leaveReason);
        reasonInput.clear();
        reasonInput.sendKeys(reason);

        waitForElement(leaveSubmitBtn).click();
    }

    public void submitQuery(String subject, String message) {
        WebElement subjectInput = waitForElement(querySubject);
        subjectInput.clear();
        subjectInput.sendKeys(subject);

        WebElement messageInput = waitForElement(queryMessage);
        messageInput.clear();
        messageInput.sendKeys(message);

        waitForElement(querySubmitBtn).click();
    }

    public void confirmAttendance() {
        try {
            By activeBtn = By.className("active-today");
            if (driver.findElements(activeBtn).size() > 0) {
                driver.findElement(activeBtn).click();
            }
        } catch (Exception e) {
            // Modal not present
        }
    }

    // Edit profile actions
    private final By editProfileBtn = By.className("edit-profile-btn");
    private final By editNameInput = By.xpath("//label[text()='FULL NAME']/following-sibling::input");
    private final By editEmailInput = By.xpath("//label[text()='EMAIL ADDRESS']/following-sibling::input");
    private final By editPhoneInput = By.xpath("//label[text()='PHONE NUMBER']/following-sibling::input");
    private final By editDobInput = By.xpath("//label[text()='DATE OF BIRTH']/following-sibling::input");
    private final By saveChangesBtn = By.xpath("//button[text()='Save Changes']");

    public void clickEditProfile() {
        waitForElement(editProfileBtn).click();
    }

    private void setDateViaJS(WebElement element, String dateValue) {
        org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) driver;
        js.executeScript(
            "var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; " +
            "nativeInputValueSetter.call(arguments[0], arguments[1]); " +
            "arguments[0].dispatchEvent(new Event('input', { bubbles: true })); " +
            "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", 
            element, dateValue
        );
    }

    public void updateProfileDetails(String name, String email, String phone, String dob) {
        WebElement nameEl = waitForElement(editNameInput);
        nameEl.clear();
        nameEl.sendKeys(name);

        WebElement emailEl = waitForElement(editEmailInput);
        emailEl.clear();
        emailEl.sendKeys(email);

        WebElement phoneEl = waitForElement(editPhoneInput);
        phoneEl.clear();
        phoneEl.sendKeys(phone);

        WebElement dobEl = waitForElement(editDobInput);
        setDateViaJS(dobEl, dob);

        waitForElement(saveChangesBtn).click();
    }

    public String getProfileDisplayName() {
        return waitForElement(By.className("user-profile-display-name")).getText();
    }

    public String getProfileEmail() {
        return waitForElement(By.xpath("//div[contains(@class,'info-attribute-row') and .//span[text()='Email Address']]/strong")).getText();
    }

    public String getProfilePhone() {
        return waitForElement(By.xpath("//div[contains(@class,'info-attribute-row') and .//span[text()='Phone Number']]/strong")).getText();
    }

    // Projects actions
    private final By chatInput = By.xpath("//form[contains(@class,'portal-chat-input-bar')]/input");
    private final By chatSendBtn = By.xpath("//form[contains(@class,'portal-chat-input-bar')]/button[@type='submit']");
    private final By chatMessageBubbles = By.className("chat-message-row");

    public void sendChatMessage(String message) {
        WebElement input = waitForElement(chatInput);
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", input);
        try { Thread.sleep(500); } catch (Exception ignored) {}
        input.clear();
        input.sendKeys(message);
        WebElement sendBtn = waitForElement(chatSendBtn);
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", sendBtn);
        sendBtn.click();
    }

    public String getLastChatMessageText() {
        java.util.List<WebElement> messages = driver.findElements(chatMessageBubbles);
        if (!messages.isEmpty()) {
            WebElement lastMsg = messages.get(messages.size() - 1);
            return lastMsg.findElement(By.className("chat-sender-text")).getText();
        }
        return "";
    }

    public void updateTaskProgress(int taskIndex, int progress) {
        java.util.List<WebElement> tasks = driver.findElements(By.cssSelector(".portal-task-item.assigned-me"));
        if (taskIndex < tasks.size()) {
            WebElement task = tasks.get(taskIndex);
            WebElement slider = task.findElement(By.className("progress-range-slider"));
            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", slider);
            try { Thread.sleep(500); } catch (Exception ignored) {}
            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
                "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', { bubbles: true })); arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", 
                slider, progress
            );
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            WebElement saveBtn = task.findElement(By.className("update-progress-btn"));
            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", saveBtn);
            try { Thread.sleep(500); } catch (Exception ignored) {}
            saveBtn.click();
        }
    }

    public String getTaskProgressPercent(int taskIndex) {
        java.util.List<WebElement> tasks = driver.findElements(By.cssSelector(".portal-task-item.assigned-me"));
        if (taskIndex < tasks.size()) {
            WebElement task = tasks.get(taskIndex);
            return task.findElement(By.className("progress-lbl")).getText();
        }
        return "";
    }
}
