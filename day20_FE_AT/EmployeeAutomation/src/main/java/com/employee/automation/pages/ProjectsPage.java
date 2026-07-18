package com.employee.automation.pages;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Page Object for the Projects management page (/projects).
 *
 * <p>Covers the project toolbar (search + create), the side-drawer form
 * (name, description, status, deadline, member assignment), the project
 * cards grid, and per-card actions (edit, delete).</p>
 */
public class ProjectsPage extends BasePage {

    // ── @FindBy — Toolbar ──────────────────────────────────────────────────────

    @FindBy(xpath = "//button[contains(.,'Create Project')]")
    private WebElement createProjectBtn;

    @FindBy(xpath = "//section[contains(@class,'projects-toolbar')]//input")
    private WebElement searchInput;

    // ── @FindBy — Side Drawer: Text / Date Inputs ──────────────────────────────

    @FindBy(xpath = "//div[contains(@class,'project-drawer')]//input[@type='text']")
    private WebElement projectNameInput;

    @FindBy(xpath = "//div[contains(@class,'project-drawer')]//textarea")
    private WebElement descriptionInput;

    @FindBy(xpath = "//div[contains(@class,'project-drawer')]//input[@type='date']")
    private WebElement deadlineInput;

    // ── @FindBy — Side Drawer: Selects ────────────────────────────────────────

    /**
     * Status select — anchored by its label "Progress Status".
     */
    @FindBy(xpath =
        "//div[contains(@class,'project-drawer')]" +
        "//label[text()='Progress Status']/following-sibling::select")
    private WebElement statusDropdown;

    /**
     * Member select — uniquely identified by its wrapper class
     * {@code add-member-widget}.
     */
    @FindBy(css = ".add-member-widget select")
    private WebElement memberSelect;

    // ── @FindBy — Side Drawer: Buttons ────────────────────────────────────────

    @FindBy(xpath = "//div[contains(@class,'project-drawer')]//button[contains(.,'Add')]")
    private WebElement addMemberBtn;

    @FindBy(xpath = "//div[contains(@class,'project-drawer')]//button[@type='submit']")
    private WebElement submitDrawerBtn;

    @FindBy(xpath = "//div[contains(@class,'project-drawer')]//button[contains(.,'Cancel')]")
    private WebElement cancelDrawerBtn;

    // ── Constructor ────────────────────────────────────────────────────────────

    public ProjectsPage(WebDriver driver) {
        super(driver);
    }

    // ── Toolbar Actions ────────────────────────────────────────────────────────

    /** Click the "Create Project" button to open the side drawer. */
    public void clickCreateProject() {
        waitForClickable(createProjectBtn).click();
    }

    /**
     * Type a search query into the projects search box.
     *
     * @param query project name fragment to search for
     */
    public void enterSearchQuery(String query) {
        WebElement el = waitForVisible(searchInput);
        el.clear();
        el.sendKeys(query);
    }

    // ── Drawer Form ────────────────────────────────────────────────────────────

    /**
     * Fill the project drawer form with the four core fields.
     *
     * @param name        project title
     * @param description project description
     * @param status      visible option text e.g. "Active", "On Hold"
     * @param deadline    ISO date string e.g. "2026-12-31"
     */
    public void fillProjectDetails(String name, String description,
                                   String status, String deadline) {
        WebElement nameEl = waitForVisible(projectNameInput);
        nameEl.clear();
        nameEl.sendKeys(name);

        WebElement descEl = waitForVisible(descriptionInput);
        descEl.clear();
        descEl.sendKeys(description);

        jsSetSelect(waitForVisible(statusDropdown), status);
        jsSetValue(waitForVisible(deadlineInput), deadline);
    }

    /**
     * Select a team member by name fragment from the member dropdown
     * and click "Add" to add them to the project.
     *
     * <p>Uses {@code driver.findElements} so that if the dropdown is absent
     * (e.g. all employees are already assigned) the method returns silently
     * instead of throwing a {@link org.openqa.selenium.TimeoutException}.</p>
     *
     * @param employeeName partial or full employee name
     */
    public void assignMember(String employeeName) {
        // Re-find every time — React may re-render the drawer after fillProjectDetails
        List<WebElement> dropdowns = driver.findElements(
                By.cssSelector(".add-member-widget select"));
        if (dropdowns.isEmpty()) {
            System.out.println("[WARN] Member select not found — skipping assignMember");
            return;
        }
        WebElement dropdown = dropdowns.get(0);
        org.openqa.selenium.support.ui.Select sel =
                new org.openqa.selenium.support.ui.Select(dropdown);
        for (WebElement opt : sel.getOptions()) {
            if (opt.getText().contains(employeeName)) {
                sel.selectByVisibleText(opt.getText());
                // Re-find the Add button after selecting to avoid stale refs
                List<WebElement> addBtns = driver.findElements(
                        By.xpath(".//button[contains(.,'Add')]"));
                if (!addBtns.isEmpty()) {
                    addBtns.get(0).click();
                } else {
                    waitForClickable(addMemberBtn).click();
                }
                return;
            }
        }
        System.out.println("[WARN] Employee '" + employeeName +
                "' not found in member dropdown — skipping");
    }

    /** Submit the drawer form ("Create" or "Update"). */
    public void clickSubmitDrawer() {
        waitForClickable(submitDrawerBtn).click();
    }

    /** Cancel / close the side drawer without saving. */
    public void clickCancelDrawer() {
        waitForClickable(cancelDrawerBtn).click();
    }

    // ── Project Card Accessors ─────────────────────────────────────────────────

    /**
     * Find and return the first project card whose title contains
     * {@code projectName}.
     *
     * @return the card {@link WebElement}, or {@code null} if not found
     */
    public WebElement getProjectCard(String projectName) {
        List<WebElement> cards = driver.findElements(By.xpath(
            "//div[contains(@class,'project-card')" +
            " and .//h3[contains(text(),'" + projectName + "')]]"));
        return cards.isEmpty() ? null : cards.get(0);
    }

    // ── Project Card Actions ───────────────────────────────────────────────────

    /**
     * Click the "Edit Details" button on the card for {@code projectName}.
     */
    public void clickEditProject(String projectName) {
        WebElement card = getProjectCard(projectName);
        if (card != null) {
            card.findElement(
                By.xpath(".//button[contains(.,'Edit Details')]")).click();
        }
    }

    /**
     * Click the delete button on the card for {@code projectName}
     * and accept the native browser confirmation alert if one appears.
     */
    public void clickDeleteProject(String projectName) {
        WebElement card = getProjectCard(projectName);
        if (card != null) {
            card.findElement(
                By.xpath(".//button[not(contains(.,'Edit Details'))]")).click();
            try {
                driver.switchTo().alert().accept();
            } catch (Exception ignored) {
                // Modal-based confirmation — handled by the app component
            }
        }
    }
}
