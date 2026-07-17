package com.cucumber.runner;

import org.junit.runner.RunWith;
import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;

@SuppressWarnings("deprecation")
@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    glue = "com.cucumber.testdefinitions",
    plugin = {"pretty", "html:target/cucumber-report.html"}
)
public class TestRunner {
}
