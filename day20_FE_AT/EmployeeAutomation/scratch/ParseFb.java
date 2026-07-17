import javax.swing.text.MutableAttributeSet;
import javax.swing.text.html.HTML;
import javax.swing.text.html.HTMLEditorKit;
import javax.swing.text.html.parser.ParserDelegator;
import java.io.File;
import java.io.Reader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.stream.Collectors;

public class ParseFb {
    public static void main(String[] args) {
        try {
            File htmlFile = findHtmlFile();
            if (htmlFile == null) {
                System.err.println("Error: Could not find target/facebook.html in any expected locations.");
                System.exit(1);
            }

            try (Reader reader = Files.newBufferedReader(htmlFile.toPath(), StandardCharsets.UTF_8)) {
                parseHtml(reader);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static File findHtmlFile() {
        String[] potentialPaths = {
            "../target/facebook.html",
            "target/facebook.html",
            "EmployeeAutomation/target/facebook.html",
            "../EmployeeAutomation/target/facebook.html"
        };
        for (String path : potentialPaths) {
            File file = new File(path);
            if (file.exists()) {
                return file;
            }
        }
        // Try directory of the class file
        try {
            File classDir = new File(ParseFb.class.getProtectionDomain().getCodeSource().getLocation().toURI()).getParentFile();
            File file = new File(classDir, "../target/facebook.html");
            if (file.exists()) {
                return file;
            }
        } catch (Exception e) {
            // Fallback if class location cannot be resolved
        }
        
        return null;
    }

    private static void parseHtml(Reader reader) throws IOException {
        java.util.List<String> inputs = new java.util.ArrayList<>();
        java.util.List<String> buttons = new java.util.ArrayList<>();
        java.util.List<String> forms = new java.util.ArrayList<>();

        HTMLEditorKit.ParserCallback callback = new HTMLEditorKit.ParserCallback() {
            private boolean inButton = false;
            private String buttonId = null;
            private String buttonClass = null;
            private String buttonDataTestId = null;
            private final StringBuilder buttonText = new StringBuilder();

            private String getAttr(MutableAttributeSet a, String name) {
                for (java.util.Enumeration<?> e = a.getAttributeNames(); e.hasMoreElements(); ) {
                    Object key = e.nextElement();
                    if (key.toString().equalsIgnoreCase(name)) {
                        Object val = a.getAttribute(key);
                        return val != null ? val.toString() : "None";
                    }
                }
                return "None";
            }

            private String getClassList(MutableAttributeSet a) {
                String val = getAttr(a, "class");
                if (val.equals("None")) {
                    return "None";
                }
                String[] classes = val.split("\\s+");
                return "[" + Arrays.stream(classes)
                        .map(c -> "'" + c + "'")
                        .collect(Collectors.joining(", ")) + "]";
            }

            @Override
            public void handleStartTag(HTML.Tag t, MutableAttributeSet a, int pos) {
                String tagName = t.toString().toLowerCase();
                if (tagName.equals("form")) {
                    String id = getAttr(a, "id");
                    String action = getAttr(a, "action");
                    String method = getAttr(a, "method");
                    forms.add(String.format("id=%s, action=%s, method=%s", id, action, method));
                }
            }

            @Override
            public void handleSimpleTag(HTML.Tag t, MutableAttributeSet a, int pos) {
                String tagName = t.toString().toLowerCase();
                if (tagName.equals("input")) {
                    String id = getAttr(a, "id");
                    String name = getAttr(a, "name");
                    String clazz = getClassList(a);
                    String type = getAttr(a, "type");
                    String placeholder = getAttr(a, "placeholder");
                    inputs.add(String.format("id=%s, name=%s, class=%s, type=%s, placeholder=%s",
                            id, name, clazz, type, placeholder));
                } else if (tagName.equals("button")) {
                    String endtag = getAttr(a, "endtag");
                    if (endtag.equalsIgnoreCase("true")) {
                        if (inButton) {
                            buttons.add(String.format("id=%s, class=%s, text=%s, data-testid=%s",
                                    buttonId, buttonClass, buttonText.toString().trim(), buttonDataTestId));
                            inButton = false;
                        }
                    } else {
                        inButton = true;
                        buttonId = getAttr(a, "id");
                        buttonClass = getClassList(a);
                        buttonDataTestId = getAttr(a, "data-testid");
                        buttonText.setLength(0);
                    }
                }
            }

            @Override
            public void handleText(char[] data, int pos) {
                if (inButton) {
                    buttonText.append(data);
                }
            }
        };

        new ParserDelegator().parse(reader, callback, true);

        System.out.println("--- ALL INPUTS ---");
        for (int i = 0; i < inputs.size(); i++) {
            System.out.println(i + ": " + inputs.get(i));
        }

        System.out.println("\n--- ALL BUTTONS ---");
        for (int i = 0; i < buttons.size(); i++) {
            System.out.println(i + ": " + buttons.get(i));
        }

        System.out.println("\n--- ALL FORMS ---");
        for (int i = 0; i < forms.size(); i++) {
            System.out.println(i + ": " + forms.get(i));
        }
    }
}
