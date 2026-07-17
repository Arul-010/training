package com.employee.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import java.util.List;

public class ProjectsPage {

    private final WebDriver driver;

    public ProjectsPage(WebDriver driver) {
        this.driver = driver;
    }

    // Locators
    private final By createProjectBtn = By.xpath("//button[contains(., 'Create Project')]");
    private final By searchInput = By.xpath("//section[contains(@class, 'projects-toolbar')]//input");
    
    // Drawer Locators
    private final By projectNameInput = By.xpath("//div[contains(@class, 'project-drawer')]//input[@type='text']");
    private final By descriptionInput = By.xpath("//div[contains(@class, 'project-drawer')]//textarea");
    private final By statusDropdown = By.xpath("//div[contains(@class, 'project-drawer')]//select[not(option[contains(text(), 'Choose')])]");
    private final By deadlineInput = By.xpath("//div[contains(@class, 'project-drawer')]//input[@type='date']");
    private final By memberSelect = By.xpath("//div[contains(@class, 'project-drawer')]//select[option[contains(text(), 'Choose')]]");
    private final By addMemberBtn = By.xpath("//div[contains(@class, 'project-drawer')]//button[contains(., 'Add')]");
    private final By submitDrawerBtn = By.xpath("//div[contains(@class, 'project-drawer')]//button[@type='submit']");
    private final By cancelDrawerBtn = By.xpath("//div[contains(@class, 'project-drawer')]//button[contains(., 'Cancel')]");

    public void clickCreateProject() {
        driver.findElement(createProjectBtn).click();
    }

    public void enterSearchQuery(String query) {
        WebElement input = driver.findElement(searchInput);
        input.clear();
        input.sendKeys(query);
    }

    public void fillProjectDetails(String name, String description, String status, String deadline) {
        WebElement nameField = driver.findElement(projectNameInput);
        nameField.clear();
        nameField.sendKeys(name);

        WebElement descField = driver.findElement(descriptionInput);
        descField.clear();
        descField.sendKeys(description);

        WebElement statusField = driver.findElement(statusDropdown);
        Select statusSelect = new Select(statusField);
        statusSelect.selectByVisibleText(status);

        WebElement deadlineField = driver.findElement(deadlineInput);
        deadlineField.clear();
        deadlineField.sendKeys(deadline);
    }

    public void assignMember(String employeeName) {
        WebElement dropdown = driver.findElement(memberSelect);
        Select select = new Select(dropdown);
        
        // Find option that contains employeeName
        List<WebElement> options = select.getOptions();
        boolean found = false;
        for (WebElement option : options) {
            if (option.getText().contains(employeeName)) {
                select.selectByVisibleText(option.getText());
                found = true;
                break;
            }
        }
        
        if (found) {
            driver.findElement(addMemberBtn).click();
        }
    }

    public void clickSubmitDrawer() {
        driver.findElement(submitDrawerBtn).click();
    }

    public void clickCancelDrawer() {
        driver.findElement(cancelDrawerBtn).click();
    }

    public WebElement getProjectCard(String projectName) {
        By cardLocator = By.xpath("//div[contains(@class, 'project-card') and .//h3[contains(text(), '" + projectName + "')]]");
        List<WebElement> cards = driver.findElements(cardLocator);
        return cards.isEmpty() ? null : cards.get(0);
    }

    public void clickEditProject(String projectName) {
        WebElement card = getProjectCard(projectName);
        if (card != null) {
            card.findElement(By.xpath(".//button[contains(., 'Edit Details')]")).click();
        }
    }

    public void clickDeleteProject(String projectName) {
        WebElement card = getProjectCard(projectName);
        if (card != null) {
            // Locate the second button in action area (which represents the delete button)
            card.findElement(By.xpath(".//button[not(contains(., 'Edit Details'))]")).click();
            // Handle native alert confirmation if any
            try {
                driver.switchTo().alert().accept();
            } catch (Exception e) {
                // Native alert not triggered or handled elsewhere
            }
        }
    }
}
