package com.employee.automation.pages;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Page Object for the Helpdesk / Queries page (/queries).
 *
 * <p>Covers two tabs:
 * <ul>
 *   <li><b>Helpdesk Tickets</b> — admin resolves employee support tickets</li>
 *   <li><b>Leave Applications</b> — admin approves / rejects leave requests
 *       and adjusts the number of approved days</li>
 * </ul>
 * </p>
 */
public class QueriesPage extends BasePage {

    // ── @FindBy — Tab Navigation ───────────────────────────────────────────────

    @FindBy(xpath = "//button[contains(.,'Helpdesk Tickets')]")
    private WebElement helpdeskTabBtn;

    @FindBy(xpath = "//button[contains(.,'Leave Applications')]")
    private WebElement leaveTabBtn;

    // ── Constructor ────────────────────────────────────────────────────────────

    public QueriesPage(WebDriver driver) {
        super(driver);
    }

    // ── Tab Actions ────────────────────────────────────────────────────────────

    /** Switch to the Helpdesk Tickets tab. */
    public void clickHelpdeskTab() {
        waitForClickable(helpdeskTabBtn).click();
    }

    /** Switch to the Leave Applications tab. */
    public void clickLeaveTab() {
        waitForClickable(leaveTabBtn).click();
    }

    // ── Helpdesk Ticket Actions ────────────────────────────────────────────────

    /**
     * Find the first helpdesk ticket whose subject contains {@code subject}
     * and click its "Resolve" button.
     *
     * @param subject partial or full ticket subject text
     */
    public void resolveQuery(String subject) {
        List<WebElement> rows = driver.findElements(By.xpath(
            "//div[contains(@class,'query-admin-row')" +
            " and .//h3[contains(text(),'" + subject + "')]]"));
        if (!rows.isEmpty()) {
            rows.get(0)
                .findElement(By.xpath(".//button[contains(.,'Resolve')]"))
                .click();
        }
    }

    // ── Leave Application Accessors ────────────────────────────────────────────

    /**
     * Find and return the first leave application card for
     * {@code employeeName}.
     *
     * @return the card {@link WebElement}, or {@code null} if not found
     */
    public WebElement getLeaveCard(String employeeName) {
        List<WebElement> cards = driver.findElements(By.xpath(
            "//div[contains(@class,'leave-card')" +
            " and contains(.,'" + employeeName + "')]"));
        return cards.isEmpty() ? null : cards.get(0);
    }

    // ── Leave Application Actions ──────────────────────────────────────────────

    /**
     * Click the "Approve" button on the leave card for {@code employeeName}.
     */
    public void approveLeave(String employeeName) {
        WebElement card = getLeaveCard(employeeName);
        if (card != null) {
            card.findElement(
                By.xpath(".//button[contains(@class,'la-approve')]")).click();
        }
    }

    /**
     * Click the "Reject" button on the leave card for {@code employeeName}.
     */
    public void rejectLeave(String employeeName) {
        WebElement card = getLeaveCard(employeeName);
        if (card != null) {
            card.findElement(
                By.xpath(".//button[contains(@class,'la-reject')]")).click();
        }
    }

    /**
     * Clear the approved-days input on the leave card for
     * {@code employeeName} and type {@code targetDays}.
     *
     * @param employeeName employee whose leave card to update
     * @param targetDays   number of approved days to enter
     */
    public void adjustGrantDays(String employeeName, int targetDays) {
        WebElement card = getLeaveCard(employeeName);
        if (card != null) {
            WebElement input = card.findElement(
                By.xpath(".//input[@aria-label='Grant days count']"));
            input.clear();
            input.sendKeys(String.valueOf(targetDays));
        }
    }

    /**
     * Read the status pill text on the leave card for {@code employeeName}.
     *
     * @return status text e.g. "Approved", "Rejected", "Pending",
     *         or {@code null} if the card is not found
     */
    public String getLeaveStatus(String employeeName) {
        WebElement card = getLeaveCard(employeeName);
        if (card == null) return null;
        return card.findElement(By.className("leave-status-pill")).getText();
    }
}
