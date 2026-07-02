document.addEventListener('DOMContentLoaded', () => {
    
    // --- Hero Typing Simulator ---
    const typingText = document.getElementById('typing-text');
    const words = ["Artificial Intelligence Student", "Java Developer", "Web Developer", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 150;

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            delay = 60;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            delay = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            delay = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 500; // Pause before starting next word
        }

        setTimeout(type, delay);
    }
    
    if (typingText) {
        type();
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section, header');
    const navLinksList = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // --- Tab Filters (Projects Section) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Dynamic Skill Bar Progress Load ---
    const skillSection = document.getElementById('skills');
    const skillProgresses = document.querySelectorAll('.skill-progress');
    let animated = false;

    function animateSkillBars() {
        if (!animated) {
            skillProgresses.forEach(bar => {
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth;
            });
            animated = true;
        }
    }

    // Trigger skills loading animation when scrolled into view
    window.addEventListener('scroll', () => {
        if (skillSection) {
            const rect = skillSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight - 100) {
                animateSkillBars();
            }
        }
    });

    // Fallback trigger if already in view
    if (skillSection) {
        const rect = skillSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
            animateSkillBars();
        }
    }

    // --- Playground Stage Navigation ---
    const playgroundBtns = document.querySelectorAll('.playground-nav-btn');
    const widgets = document.querySelectorAll('.playground-widget');

    playgroundBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playgroundBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetWidgetId = btn.getAttribute('data-target');

            widgets.forEach(widget => {
                if (widget.id === targetWidgetId) {
                    widget.classList.add('active');
                } else {
                    widget.classList.remove('active');
                }
            });
        });
    });

    // ==========================================
    // INTERACTIVE WIDGET 1: CALCULATOR CODE
    // ==========================================
    const calcPrevOperand = document.getElementById('calc-prev');
    const calcCurrOperand = document.getElementById('calc-curr');
    const calcButtons = document.querySelectorAll('.calc-btn');

    let currentInput = '';
    let previousInput = '';
    let operation = undefined;

    function clearCalculator() {
        currentInput = '';
        previousInput = '';
        operation = undefined;
        updateCalculatorDisplay();
    }

    function deleteDigit() {
        currentInput = currentInput.toString().slice(0, -1);
        updateCalculatorDisplay();
    }

    function appendNumber(number) {
        if (number === '.' && currentInput.includes('.')) return;
        currentInput = currentInput.toString() + number.toString();
        updateCalculatorDisplay();
    }

    function chooseOperation(op) {
        if (currentInput === '') return;
        if (previousInput !== '') {
            compute();
        }
        operation = op;
        previousInput = currentInput;
        currentInput = '';
        updateCalculatorDisplay();
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(current)) return;
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }
        currentInput = computation;
        operation = undefined;
        previousInput = '';
        updateCalculatorDisplay();
    }

    function updateCalculatorDisplay() {
        calcCurrOperand.innerText = currentInput;
        if (operation != null) {
            calcPrevOperand.innerText = `${previousInput} ${operation}`;
        } else {
            calcPrevOperand.innerText = '';
        }
    }

    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const value = button.innerText;

            if (!action) {
                appendNumber(value);
            } else if (action === 'operator') {
                chooseOperation(value);
            } else if (action === 'clear') {
                clearCalculator();
            } else if (action === 'delete') {
                deleteDigit();
            } else if (action === 'equals') {
                compute();
            }
        });
    });

    // ==========================================
    // INTERACTIVE WIDGET 2: GUESSING GAME CODE
    // ==========================================
    const guessInput = document.getElementById('guess-input');
    const guessSubmit = document.getElementById('guess-submit');
    const guessFeedback = document.getElementById('guess-feedback');
    const guessScoreSpan = document.getElementById('guess-score');
    const guessAttemptsSpan = document.getElementById('guess-attempts');
    const guessRestartBtn = document.getElementById('guess-restart');

    let randomNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    let score = 100;
    let gameOver = false;

    function handleGuess() {
        if (gameOver) return;

        const guessVal = parseInt(guessInput.value);

        if (isNaN(guessVal) || guessVal < 1 || guessVal > 100) {
            guessFeedback.textContent = "⚠️ Enter a valid number between 1 and 100!";
            guessFeedback.className = "guess-feedback";
            return;
        }

        attempts++;
        guessAttemptsSpan.textContent = attempts;

        if (guessVal === randomNumber) {
            guessFeedback.textContent = `🎉 Spot on! The number was ${randomNumber}. You got it!`;
            guessFeedback.className = "guess-feedback correct";
            gameOver = true;
            guessRestartBtn.classList.add('show');
            guessInput.disabled = true;
        } else {
            score = Math.max(0, score - 10);
            guessScoreSpan.textContent = score;

            const difference = Math.abs(guessVal - randomNumber);
            
            if (guessVal < randomNumber) {
                if (difference <= 5) {
                    guessFeedback.textContent = "🔥 Too low! But you are VERY close!";
                    guessFeedback.className = "guess-feedback hot";
                } else if (difference <= 15) {
                    guessFeedback.textContent = "🌤️ Too low! Getting warmer.";
                    guessFeedback.className = "guess-feedback hot";
                } else {
                    guessFeedback.textContent = "❄️ Too low! And freezing cold.";
                    guessFeedback.className = "guess-feedback cold";
                }
            } else {
                if (difference <= 5) {
                    guessFeedback.textContent = "🔥 Too high! But you are VERY close!";
                    guessFeedback.className = "guess-feedback hot";
                } else if (difference <= 15) {
                    guessFeedback.textContent = "🌤️ Too high! Getting warmer.";
                    guessFeedback.className = "guess-feedback hot";
                } else {
                    guessFeedback.textContent = "❄️ Too high! And freezing cold.";
                    guessFeedback.className = "guess-feedback cold";
                }
            }

            if (score <= 0) {
                guessFeedback.textContent = `💀 Game Over! The correct number was ${randomNumber}.`;
                guessFeedback.className = "guess-feedback";
                gameOver = true;
                guessRestartBtn.classList.add('show');
                guessInput.disabled = true;
            }
        }
        guessInput.value = '';
        guessInput.focus();
    }

    if (guessSubmit) {
        guessSubmit.addEventListener('click', handleGuess);
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleGuess();
        });
    }

    if (guessRestartBtn) {
        guessRestartBtn.addEventListener('click', () => {
            randomNumber = Math.floor(Math.random() * 100) + 1;
            attempts = 0;
            score = 100;
            gameOver = false;
            
            guessAttemptsSpan.textContent = attempts;
            guessScoreSpan.textContent = score;
            guessFeedback.textContent = "I've picked a number. Make your first guess!";
            guessFeedback.className = "guess-feedback";
            guessInput.disabled = false;
            guessRestartBtn.classList.remove('show');
            guessInput.value = '';
            guessInput.focus();
        });
    }

    // ==========================================
    // INTERACTIVE WIDGET 3: TODO LIST CODE
    // ==========================================
    const todoInput = document.getElementById('todo-input');
    const todoAddBtn = document.getElementById('todo-add-btn');
    const todoList = document.getElementById('todo-list');

    let todoTasks = JSON.parse(localStorage.getItem('portfolio_todo_tasks')) || [
        "Review B.Tech AI syllabus",
        "Finish Java OOP assignment",
        "Build modern portfolio website"
    ];

    function renderTodos() {
        if (!todoList) return;
        todoList.innerHTML = '';
        todoTasks.forEach((taskText, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            
            const span = document.createElement('span');
            span.className = 'todo-item-text';
            span.textContent = taskText;
            
            const btn = document.createElement('button');
            btn.className = 'todo-item-delete';
            btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            btn.addEventListener('click', () => deleteTodo(index));
            
            li.appendChild(span);
            li.appendChild(btn);
            todoList.appendChild(li);
        });
        localStorage.setItem('portfolio_todo_tasks', JSON.stringify(todoTasks));
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text === '') return;
        todoTasks.push(text);
        todoInput.value = '';
        renderTodos();
    }

    function deleteTodo(index) {
        todoTasks.splice(index, 1);
        renderTodos();
    }

    if (todoAddBtn) {
        todoAddBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });
    }

    // Render default tasks initially
    renderTodos();

    // ==========================================
    // INTERACTIVE WIDGET 4: DEVELOPER CLI TERMINAL
    // ==========================================
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');

    const terminalCommands = {
        help: "Available commands:\n  about     - Brief summary of who I am\n  skills    - List core tech capabilities\n  education - Details of university learning\n  projects  - Summaries of built creations\n  contact   - Touchpoints to connect with me\n  matrix    - Run the virtual code simulator\n  secret    - Reveal the hidden portal easter egg\n  clear     - Wipe clean the screen buffers",
        about: "Arulselvam H\n------------\nAI student with a strong passion for Java programming, data structures, algorithms, and web development. Specializes in building responsive web tools, analyzing data concepts, and designing efficient solutions.",
        skills: "Core Technologies & Concepts:\n  ☕ Languages: Java (OOP, Structures), SQL\n  🌐 Web Development: HTML5, CSS3, ES6 JavaScript, DOM Manipulation\n  🤖 Specialization: Data Science, Machine Learning, Problem Solving",
        education: "Hindusthan Institute of Technology\n---------------------------------\nB.Tech in Artificial Intelligence and Data Science\nClass of 2023 - 2027\nActive Subjects: Operating Systems, Java Programming, AI Systems, DBMS, Networks",
        projects: "Featured Portfolios:\n  📁 Course Catalog Portal: Information listing department courses, curricula and structures.\n  📁 Validate Register/Login: Secure login form design with standard validations.\n  📁 Neumorphic Calculator: Functional math engine with key triggers.\n  📁 Number Guesser: Interactive game with precise feedback scoring.\n  📁 Persistent Planner: Storage-integrated tasks board.",
        contact: "Contact Directory:\n  📧 Email: arulrocky05@gmail.com\n  📞 Phone: +91 9655092426\n  📌 Institution: HIT Campus, Coimbatore, TN",
        secret: "⚡ EASTER EGG REVEALED ⚡\n\"The art of coding is writing instructions that both computers can run and humans can easily read.\"\nThank you for exploring my terminal. Stay curious! 🚀",
        matrix: "Loading virtual code matrix stream...\n[1] 10100100110101100101\n[2] 11001101010100101110\n[3] 01011010110010101001\nSystem status: SECURE. Welcome to AI space."
    };

    function appendTerminalLine(text, isCmd = false) {
        if (!terminalOutput) return;
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (isCmd) {
            line.innerHTML = `<span style="color: #06b6d4">guest@arulselvam:~$</span> ${text}`;
        } else {
            line.innerText = text;
        }
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmdText = terminalInput.value.trim().toLowerCase();
                terminalInput.value = '';

                if (cmdText === '') return;

                appendTerminalLine(cmdText, true);

                setTimeout(() => {
                    if (cmdText === 'clear') {
                        terminalOutput.innerHTML = '<div class="terminal-welcome">Welcome to Arulselvam\'s Portfolio CLI OS v1.0.0.<br>Type "help" to see available terminal prompts.</div>';
                    } else if (terminalCommands[cmdText]) {
                        appendTerminalLine(terminalCommands[cmdText]);
                    } else {
                        appendTerminalLine(`❌ Command not found: "${cmdText}". Type "help" to view directory of commands.`);
                    }
                }, 100);
            }
        });

        // Focus terminal input when clicking the body of the terminal
        const terminalBody = document.querySelector('.terminal-body');
        if (terminalBody) {
            terminalBody.addEventListener('click', () => {
                terminalInput.focus();
            });
        }
    }
});
