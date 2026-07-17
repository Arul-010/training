package com.employee.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import java.util.List;

public class QueriesPage {

    private final WebDriver driver;

    public QueriesPage(WebDriver driver) {
        this.driver = driver;
    }

    // Main tabs
    private final By helpdeskTabBtn = By.xpath("//button[contains(., 'Helpdesk Tickets')]");
    private final By leaveTabBtn = By.xpath("//button[contains(., 'Leave Applications')]");

    public void clickHelpdeskTab() {
        driver.findElement(helpdeskTabBtn).click();
    }

    public void clickLeaveTab() {
        driver.findElement(leaveTabBtn).click();
    }

    // Helpdesk actions
    public void resolveQuery(String subject) {
        By rowLocator = By.xpath("//div[contains(@class, 'query-admin-row') and .//h3[contains(text(), '" + subject + "')]]");
        List<WebElement> rows = driver.findElements(rowLocator);
        if (!rows.isEmpty()) {
            rows.get(0).findElement(By.xpath(".//button[contains(., 'Resolve')]")).click();
        }
    }

    // Leave actions
    public WebElement getLeaveCard(String employeeName) {
        By cardLocator = By.xpath("//div[contains(@class, 'leave-card') and contains(., '" + employeeName + "')]");
        List<WebElement> cards = driver.findElements(cardLocator);
        return cards.isEmpty() ? null : cards.get(0);
    }

    public void approveLeave(String employeeName) {
        WebElement card = getLeaveCard(employeeName);
        if (card != null) {
            card.findElement(By.xpath(".//button[contains(@class, 'la-approve')]")).click();
        }
    }

    public void rejectLeave(String employeeName) {
        WebElement card = getLeaveCard(employeeName);
        if (card != null) {
            card.findElement(By.xpath(".//button[contains(@class, 'la-reject')]")).click();
        }
    }

    public void adjustGrantDays(String employeeName, int targetDays) {
        WebElement card = getLeaveCard(employeeName);
        if (card != null) {
            WebElement input = card.findElement(By.xpath(".//input[@aria-label='Grant days count']"));
            input.clear();
            input.sendKeys(String.valueOf(targetDays));
        }
    }

    public String getLeaveStatus(String employeeName) {
        WebElement card = getLeaveCard(employeeName);
        if (card != null) {
            return card.findElement(By.className("leave-status-pill")).getText();
        }
        return null;
    }
}
