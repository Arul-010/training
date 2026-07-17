package com.cucumber.testdefinitions;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;
import com.employee.automation.pages.LoginPage;

public class LoginSteps {

    WebDriver driver;
    LoginPage loginPage;
    String storedUsername;

    @Given("User opens the login page")
    public void user_opens_the_login_page() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("http://localhost:5173/login");
        loginPage = new LoginPage(driver);
    }

    @When("user enters the username {string}")
    public void user_enters_the_username(String user) {
        this.storedUsername = user;
    }

    @When("user enters the password {string}")
    public void user_enters_the_password(String pass) {
        // Password not required for sandbox employee portal
    }

    @Then("click the Login Button")
    public void click_the_login_button() throws InterruptedException {
        if ("admin".equalsIgnoreCase(storedUsername)) {
            loginPage.loginAsAdmin();
        } else {
            String name = storedUsername;
            if (storedUsername.contains("@")) {
                name = storedUsername.split("@")[0];
            }
            loginPage.loginAsEmployee(name);
        }
        Thread.sleep(3000);
        driver.quit();
    }
}