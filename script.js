// Terminal Portfolio JavaScript

class TerminalPortfolio {
    constructor() {
        this.commandInput = document.getElementById('commandInput');
        this.output = document.getElementById('output');
        this.landingOverlay = document.getElementById('landingOverlay');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '~';
        this.helpTyped = false;
        
        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            skills: this.showSkills.bind(this),
            projects: this.showProjects.bind(this),
            education: this.showEducation.bind(this),
            resume: this.showResume.bind(this),
            contact: this.showContact.bind(this),
            clear: this.clearTerminal.bind(this),
            whoami: this.whoami.bind(this),
            ls: this.listDirectory.bind(this),
            pwd: this.printWorkingDirectory.bind(this),
            date: this.showDate.bind(this),
            echo: this.echo.bind(this)
        };
        
        this.init();
    }
    
    generateAsciiArt(text) {
        // ASCII character mappings for block letters
        const asciiChars = {
            'J': [
                '     ██╗',
                '     ██║',
                '     ██║',
                '██   ██║',
                '╚█████╔╝',
                ' ╚════╝ '
            ],
            'O': [
                ' ██████╗ ',
                '██╔═══██╗',
                '██║   ██║',
                '██║   ██║',
                '╚██████╔╝',
                ' ╚═════╝ '
            ],
            'L': [
                '██╗     ',
                '██║     ',
                '██║     ',
                '██║     ',
                '███████╗',
                '╚══════╝'
            ],
            'I': [
                '██╗',
                '██║',
                '██║',
                '██║',
                '██║',
                '╚═╝'
            ],
            'N': [
                '███╗   ██╗',
                '████╗  ██║',
                '██╔██╗ ██║',
                '██║╚██╗██║',
                '██║ ╚████║',
                '╚═╝  ╚═══╝'
            ],
            'A': [
                ' █████╗ ',
                '██╔══██╗',
                '███████║',
                '██╔══██║',
                '██║  ██║',
                '╚═╝  ╚═╝'
            ],
            ' ': [
                '      ',
                '      ',
                '      ',
                '      ',
                '      ',
                '      '
            ],
            'V': [
                '██╗   ██╗',
                '██║   ██║',
                '██║   ██║',
                '╚██╗ ██╔╝',
                ' ╚████╔╝ ',
                '  ╚═══╝  '
            ],
            'E': [
                '███████╗',
                '██╔════╝',
                '█████╗  ',
                '██╔══╝  ',
                '███████╗',
                '╚══════╝'
            ],
            'R': [
                '██████╗ ',
                '██╔══██╗',
                '██████╔╝',
                '██╔══██╗',
                '██║  ██║',
                '╚═╝  ╚═╝'
            ]
        };
        
        const lines = ['', '', '', '', '', ''];
        const chars = text.toUpperCase().split('');
        
        chars.forEach(char => {
            const charLines = asciiChars[char] || asciiChars[' '];
            for (let i = 0; i < 6; i++) {
                lines[i] += charLines[i];
            }
        });
        
        return lines.join('\n');
    }
    
    initWelcomeSection() {
        const asciiNameElement = document.getElementById('ascii-name');
        if (asciiNameElement) {
            // Apply the same ASCII art styling as the landing page
             asciiNameElement.innerHTML = `<pre class="landing-ascii">
      ██╗ ██████╗ ██╗     ██╗███╗   ██╗ █████╗         ██╗ █████╗ ██╗   ██╗██╗███████╗██████╗ 
      ██║██╔═══██╗██║     ██║████╗  ██║██╔══██╗        ██║██╔══██╗██║   ██║██║██╔════╝██╔══██╗
      ██║██║   ██║██║     ██║██╔██╗ ██║███████║        ██║███████║██║   ██║██║█████╗  ██████╔╝
 ██   ██║██║   ██║██║     ██║██║╚██╗██║██╔══██║   ██   ██║██╔══██║╚██╗ ██╔╝██║██╔══╝  ██╔══██╗
 ╚█████╔╝╚██████╔╝███████╗██║██║ ╚████║██║  ██║   ╚█████╔╝██║  ██║ ╚████╔╝ ██║███████╗██║  ██║
  ╚════╝  ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝    ╚════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝╚═╝  ╚═╝
             </pre>`;
        }
    }
    
    animateAsciiName(element, text) {
        this.asciiAnimationActive = true;
        this.currentAsciiTimer = null;
        this.currentAsciiTimeout = null;
        
        const animateOnce = () => {
            if (!this.asciiAnimationActive) return;
            
            const lines = text.split('\n');
            let currentLine = 0;
            element.innerHTML = '';
            element.classList.add('typing');
            
            const animateNextLine = () => {
                if (!this.asciiAnimationActive) return;
                
                if (currentLine < lines.length) {
                    // Add the current line
                    if (currentLine > 0) {
                        element.innerHTML += '\n';
                    }
                    element.innerHTML += lines[currentLine];
                    currentLine++;
                    
                    // Schedule next line
                    this.currentAsciiTimeout = setTimeout(animateNextLine, 200);
                } else {
                    // Animation complete
                    element.classList.remove('typing');
                    element.classList.add('finished');
                    
                    // Loop the animation continuously until 'help' is typed
                    this.currentAsciiTimeout = setTimeout(() => {
                        if (this.asciiAnimationActive && !this.helpTyped) {
                            animateOnce();
                        }
                    }, 2000);
                }
            };
            
            animateNextLine();
        };
        
        animateOnce();
    }
    
    stopAsciiAnimation() {
        this.asciiAnimationActive = false;
        if (this.currentAsciiTimer) {
            clearInterval(this.currentAsciiTimer);
        }
        if (this.currentAsciiTimeout) {
            clearTimeout(this.currentAsciiTimeout);
        }
    }
    
    init() {
        this.commandInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.setupLandingPage();
        this.commandInput.focus();
        
        // Initialize ASCII art in welcome section after a short delay
        setTimeout(() => {
            this.initWelcomeSection();
        }, 100);
        
        // Show welcome message with typing effect
        setTimeout(() => {
            this.typeText('Type "help" to see available commands.', 'info');
        }, 1000);
        
        // Keep input focused
        document.addEventListener('click', () => {
            this.commandInput.focus();
        });
    }
    
    setupLandingPage() {
        // Handle Enter key press on landing page
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.landingOverlay && !this.landingOverlay.classList.contains('hidden')) {
                this.hideLandingPage();
            }
        });
        
        // Also handle click on landing page
        if (this.landingOverlay) {
            this.landingOverlay.addEventListener('click', () => {
                this.hideLandingPage();
            });
        }
        
        // Start typewriter animation
        this.startTypewriterAnimation();
    }
    
    startTypewriterAnimation() {
        const text1 = "Hi! I'm Jolina Javier, a passionate UI/UX Designer and Front-End Developer.";
        const text2 = "I enjoy creating intuitive and user-friendly digital experiences.";
        
        const typewriter1 = document.getElementById('typewriter1');
        const typewriter2 = document.getElementById('typewriter2');
        const instructionDiv = document.querySelector('.landing-instruction');
        
        // Hide instruction initially
        if (instructionDiv) {
            instructionDiv.style.opacity = '0';
            instructionDiv.style.transition = 'opacity 0.5s ease-in';
        }
        
        if (typewriter1 && typewriter2) {
            // Start first line immediately (no continuous animation)
            this.typeTextTypewriter(typewriter1, text1, 50, () => {
                // Start second line after first is complete
                setTimeout(() => {
                    this.typeTextTypewriter(typewriter2, text2, 50, () => {
                        // Show instruction after both lines are complete
                        setTimeout(() => {
                            if (instructionDiv) {
                                instructionDiv.style.opacity = '1';
                            }
                        }, 500);
                    });
                }, 500);
            });
        }
    }
    
    typeTextTypewriter(element, text, speed, callback) {
        let i = 0;
        element.innerHTML = '';
        element.classList.add('typing');
        element.style.width = '0';
        element.style.display = 'inline-block';
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                element.style.width = (i + 1) * 0.6 + 'em';
                i++;
            } else {
                clearInterval(timer);
                element.classList.remove('typing');
                element.classList.add('finished');
                element.style.width = 'auto';
                
                if (callback) {
                    callback();
                }
            }
        }, speed);
    }
    
    hideLandingPage() {
        if (this.landingOverlay) {
            this.landingOverlay.classList.add('hidden');
            // Focus on terminal input after landing page disappears
            setTimeout(() => {
                this.commandInput.focus();
            }, 500);
        }
    }
    
    handleKeyDown(e) {
        switch(e.key) {
            case 'Enter':
                this.stopAsciiAnimation();
                this.processCommand();
                break;
            case 'ArrowUp':
                this.navigateHistory(-1);
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.navigateHistory(1);
                e.preventDefault();
                break;
            case 'Tab':
                this.autoComplete();
                e.preventDefault();
                break;
        }
    }
    
    processCommand() {
        const input = this.commandInput.value.trim();
        if (!input) return;
        
        // Add to history
        this.commandHistory.push(input);
        this.historyIndex = this.commandHistory.length;
        
        // Display command
        this.addOutput(`jolina@portfolio:${this.currentPath}$ ${input}`, 'command-line');
        
        // Parse and execute command
        const [command, ...args] = input.split(' ');
        
        if (this.commands[command]) {
            // Stop ASCII animation when help is typed
            if (command === 'help') {
                this.helpTyped = true;
                this.stopAsciiAnimation();
            }
            this.commands[command](args);
        } else {
            this.addOutput(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
        }
        
        // Clear input
        this.commandInput.value = '';
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.commandInput.value = '';
            return;
        }
        
        this.commandInput.value = this.commandHistory[this.historyIndex] || '';
    }
    
    autoComplete() {
        const input = this.commandInput.value;
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.commandInput.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(`Available commands: ${matches.join(', ')}`, 'info');
        }
    }
    
    addOutput(text, className = '') {
        const div = document.createElement('div');
        div.className = `command-output ${className}`;
        div.innerHTML = text;
        this.output.appendChild(div);
    }
    
    typeText(text, className = '', delay = 50) {
        const div = document.createElement('div');
        div.className = `command-output ${className}`;
        this.output.appendChild(div);
        
        // Check if text contains HTML tags
        const hasHTML = /<[^>]*>/.test(text);
        
        if (hasHTML) {
            // For HTML content, type character by character but preserve HTML structure
            let i = 0;
            let currentHTML = '';
            const typeInterval = setInterval(() => {
                currentHTML += text[i];
                // Update innerHTML to render HTML properly
                div.innerHTML = currentHTML;
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, delay);
        } else {
            // For plain text, use textContent as before
            let i = 0;
            const typeInterval = setInterval(() => {
                div.textContent += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, delay);
        }
    }
    
    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    // Command implementations
    showHelp() {
        const helpText = `
<div class="help-section">
    <div class="help-title">Available Commands:</div>
    <div class="help-commands">
        <div class="help-command"><span class="command-name">help</span> - Show this help message</div>
        <div class="help-command"><span class="command-name">about</span> - Learn more about Jolina</div>
        <div class="help-command"><span class="command-name">skills</span> - View technical skills and tools</div>
        <div class="help-command"><span class="command-name">projects</span> - Browse portfolio projects</div>
        <div class="help-command"><span class="command-name">education</span> - View educational background</div>
        <div class="help-command"><span class="command-name">resume</span> - Download resume (UI/UX or Front-End)</div>
        <div class="help-command"><span class="command-name">contact</span> - Get contact information</div>
        <div class="help-command"><span class="command-name">clear</span> - Clear the terminal</div>
        <div class="help-command"><span class="command-name">whoami</span> - Display current user</div>
        <div class="help-command"><span class="command-name">ls</span> - List directory contents</div>
        <div class="help-command"><span class="command-name">pwd</span> - Print working directory</div>
        <div class="help-command"><span class="command-name">date</span> - Show current date and time</div>
        <div class="help-command"><span class="command-name">echo</span> - Display a line of text</div>
    </div>
</div>`;
        this.addOutput(helpText);
    }
    
    showAbout() {
        this.addOutput('About Me', 'help-title');
        this.addOutput('', '');
        
        setTimeout(() => {
            const aboutContent = `
                <div class="about-section">
                    <div class="about-intro">
                        <p>Hi! I'm <strong>Jolina Javier</strong>, a passionate <span class="highlight">UI/UX Designer</span> and <span class="highlight">Front-End Developer</span>.</p>
                        <p>I enjoy creating intuitive and user-friendly digital experiences that solve real-world problems.</p>
                        <p>I believe that thoughtful design can make technology accessible, enjoyable, and meaningful for everyone.</p>
                    </div>
                    
                    <div class="about-focus">
                        <div class="focus-title">🎯 I focus on:</div>
                        <div class="focus-list">
                            <div class="focus-item">• Designing seamless interfaces with attention to detail and aesthetics</div>
                            <div class="focus-item">• Conducting UX research to understand user needs and behavior</div>
                            <div class="focus-item">• Developing responsive and interactive web and mobile solutions</div>
                            <div class="focus-item">• Transforming ideas into functional prototypes and interactive designs</div>
                        </div>
                    </div>
                    
                    <div class="about-philosophy">
                        <p>I am constantly learning and improving my craft. I approach each project with <span class="highlight">curiosity</span>, <span class="highlight">empathy</span>, and <span class="highlight">creativity</span>, aiming to deliver designs that not only look good but also enhance user experience.</p>
                    </div>
                    
                    <div class="about-projects">
                        <div class="projects-title">🚀 Some of my projects include:</div>
                        <div class="projects-list">
                            <div class="project-brief">• Travel and tour website for planning trips efficiently</div>
                            <div class="project-brief">• Broccobae vegan website for discovering and exploring recipes</div>
                            <div class="project-brief">• Caldef app for calculating daily calorie intake for diet management</div>
                            <div class="project-brief">• Globetrone Bank App case study showcasing UX research and prototypes</div>
                            <div class="project-brief">• Globetrone functioning prototype app demonstrating practical banking solutions</div>
                        </div>
                    </div>
                    
                    <div class="about-goal">
                        <p>My goal is to use design as a tool to solve problems, inspire users, and make digital experiences more accessible. I love exploring new ideas, experimenting with design tools, and learning from each project to become a better designer.</p>
                    </div>
                    
                    <div class="about-cta">
                        <p>💡 Type <span class="command-highlight">'projects'</span> to see my work, or <span class="command-highlight">'contact'</span> to get in touch!</p>
                    </div>
                </div>`;
            this.addOutput(aboutContent, 'about-content');
        }, 300);
    }
    
    showSkills() {
        const technicalSkills = [
            { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
            { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
            { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
            { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
            { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
            { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
            { name: 'Hosting', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg' },
            { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' }
        ];
        
        const designSkills = [
            { name: 'Responsive Design', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
            { name: 'Visual Layout', icon: 'https://img.icons8.com/fluency/48/design.png' },
            { name: 'Project Execution', icon: 'https://img.icons8.com/fluency/48/project-management.png' },
            { name: 'Collaboration', icon: 'https://img.icons8.com/fluency/48/collaboration.png' },
            { name: 'Adaptability', icon: 'https://img.icons8.com/color/48/change.png' }
        ];
        
        this.addOutput('Skills Portfolio:', 'help-title');
        this.addOutput('', '');
        
        // Technical Skills Section
        setTimeout(() => {
            this.typeText('Technical Skills & Tools:', 'section-title', 30);
        }, 200);
        
        setTimeout(() => {
            let techTable = '<table style="width: 100%; margin: 10px 0;"><tr>';
            technicalSkills.forEach((skill, index) => {
                if (index % 4 === 0 && index > 0) {
                    techTable += '</tr><tr>';
                }
                techTable += `<td align="center" style="width: 120px; padding: 10px;">
                    <img src="${skill.icon}" width="48" height="48" style="filter: brightness(0.9);" />
                    <br><span style="color: #00ff00; font-size: 0.9em;">${skill.name}</span>
                </td>`;
            });
            techTable += '</tr></table>';
            this.addOutput(techTable, 'skills-table');
        }, 800);
        
        // Design & Soft Skills Section
        setTimeout(() => {
            this.addOutput('', '');
            this.typeText('Design & Soft Skills:', 'section-title', 30);
        }, 1400);
        
        setTimeout(() => {
            let designTable = '<table style="width: 100%; margin: 10px 0;"><tr>';
            designSkills.forEach((skill, index) => {
                if (index % 3 === 0 && index > 0) {
                    designTable += '</tr><tr>';
                }
                designTable += `<td align="center" style="width: 150px; padding: 10px;">
                    <img src="${skill.icon}" width="48" height="48" style="filter: brightness(0.9);" />
                    <br><span style="color: #00ff00; font-size: 0.9em;">${skill.name}</span>
                </td>`;
            });
            designTable += '</tr></table>';
            this.addOutput(designTable, 'skills-table');
        }, 2000);
        
        setTimeout(() => {
            this.addOutput('', '');
            this.typeText('💡 Always learning and expanding my skillset!', 'info', 40);
        }, 2600);
    }
    
    showProjects() {
        const projects = [
            { 
                name: 'Broccobae.com', 
                url: 'https://broccobae.com', 
                description: 'A website designed to showcase vegan recipes, helping users discover meal ideas with images, categories, and easy navigation for cooking inspiration.' 
            },
            { 
                name: 'Caldef', 
                url: 'https://github.com/jolina/Caldef', 
                description: 'A web application that calculates daily food intake and tracks the weight of meals for individuals following a diet deficit plan, helping users manage nutrition and health goals.' 
            },
            { 
                name: 'Coffee App', 
                url: 'https://github.com/jolina/Coffee-App', 
                description: 'A mobile and web app design for ordering coffee online, featuring intuitive user flow, menu browsing, order tracking, and an interactive interface for customers to customize and place orders.' 
            },
            { 
                name: 'Globetrone Bank App', 
                url: 'https://github.com/jolina/Globetrone-Bank-App', 
                description: 'A banking app concept designed for international users and foreign workers in Japan, including features for currency exchange, international money transfers, account management, and secure transactions.' 
            },
            { 
                name: 'Globetrone Case Study', 
                url: 'https://jolinajavier02.github.io/Globetrone-Case-Study/', 
                description: 'A detailed UX case study documenting the research, wireframes, user flows, and prototypes of the Globetrone Bank App, focusing on problem-solving and creating a user-friendly financial experience.' 
            }
        ];
        
        this.addOutput('Projects Portfolio:', 'help-title');
        this.addOutput('', '');
        
        let delay = 0;
        projects.forEach((project, index) => {
            setTimeout(() => {
                const projectLine = `${index + 1}. <a href="${project.url}" target="_blank" class="project-link">${project.name}</a>`;
                this.typeText(projectLine, 'project-item', 30);
            }, delay);
            delay += 800;
            
            setTimeout(() => {
                this.typeText(`   ${project.description}`, 'project-description', 20);
                this.addOutput('', '');
            }, delay);
            delay += 1000;
        });
        
        setTimeout(() => {
            this.typeText('💡 Click on any project name to open it in a new tab', 'info', 40);
        }, delay + 300);
    }
    
    showEducation() {
        this.addOutput('Education & Certifications:', 'help-title');
        this.addOutput('', '');
        
        // Google UX Design Certificate
        setTimeout(() => {
            const googleCert = `
                <div class="education-entry">
                    <div class="education-header">
                        <img src="https://img.icons8.com/color/48/000000/google-logo.png" width="32" height="32" style="vertical-align: middle; margin-right: 10px;" />
                        <strong>Google UX Design Certificate — Coursera</strong>
                        <span class="education-date">Jul–Oct 2024</span>
                    </div>
                    <div class="education-courses">
                        <div class="course-item">✅ 1. Foundations of User Experience (UX) Design</div>
                        <div class="course-item">✅ 2. Start the UX Design Process: Empathize, Define, and Ideate</div>
                        <div class="course-item">✅ 3. Build Wireframes and Low-Fidelity Prototypes</div>
                        <div class="course-item">✅ 4. Conduct UX Research and Test Early Concepts</div>
                        <div class="course-item">✅ 5. Create High-Fidelity Designs and Prototypes in Figma</div>
                        <div class="course-item">✅ 6. Responsive Web Design in Adobe XD and Figma</div>
                        <div class="course-item">✅ 7. Design a User Experience for Social Good & Prepare for Jobs</div>
                    </div>
                </div>`;
            this.addOutput(googleCert, 'education-section');
        }, 300);
        
        // UI/UX Design Specialization
        setTimeout(() => {
            const calartsCert = `
                <div class="education-entry">
                    <div class="education-header">
                        <img src="https://img.icons8.com/fluency/48/000000/adobe-xd.png" width="32" height="32" style="vertical-align: middle; margin-right: 10px;" />
                        <strong>UI/UX Design Specialization — California Institute of the Arts / Coursera</strong>
                        <span class="education-date">Jul–Oct 2024</span>
                    </div>
                    <div class="education-courses">
                        <div class="course-item">✅ 1. Visual Elements of User Interface Design</div>
                        <div class="course-item">✅ 2. UX Design Fundamentals</div>
                    </div>
                </div>`;
            this.addOutput(calartsCert, 'education-section');
        }, 1200);
        
        // Bachelor's Degree
        setTimeout(() => {
            const bachelorDegree = `
                <div class="education-entry">
                    <div class="education-header">
                        <span style="font-size: 32px; margin-right: 10px; vertical-align: middle;">🎓</span>
                        <strong>Bachelor of Science in Hospitality Management — University of Eastern Philippines</strong>
                        <span class="education-date">2020–2024</span>
                    </div>
                    <div class="education-description">
                        Foundation in customer service, project management, and business operations.
                    </div>
                </div>`;
            this.addOutput(bachelorDegree, 'education-section');
        }, 2100);
        
        setTimeout(() => {
            this.addOutput('', '');
            this.typeText('🌟 Continuously learning and growing in UX/UI design!', 'info', 40);
        }, 2800);
    }
    
    showResume() {
        this.addOutput('Resume Downloads:', 'help-title');
        this.addOutput('', '');
        
        const resumeText = `
<div class="resume-section">
    <div class="resume-option">
        <div class="resume-header">
            <span style="font-size: 24px; margin-right: 10px;">📄</span>
            <strong style="color: #00ff00;">UI/UX Designer Resume</strong>
        </div>
        <div class="resume-description">
            Focused on user experience design, research, and interface design skills.
        </div>
        <div class="resume-download">
            <a href="UI_UX Designer Resume.pdf" download="Jolina_Javier_UIUX_Resume.pdf" 
               style="color: #74c0fc; text-decoration: none; font-weight: bold;"
               onmouseover="this.style.color='#339af0'" 
               onmouseout="this.style.color='#74c0fc'">
               📥 Download UI/UX Resume
            </a>
        </div>
    </div>
    
    <div class="resume-option">
        <div class="resume-header">
            <span style="font-size: 24px; margin-right: 10px;">💻</span>
            <strong style="color: #00ff00;">Front-End Developer Resume</strong>
        </div>
        <div class="resume-description">
            Highlighting technical skills, programming languages, and development projects.
        </div>
        <div class="resume-download">
            <a href="Front end Developer Resume.pdf" download="Jolina_Javier_Frontend_Resume.pdf" 
               style="color: #74c0fc; text-decoration: none; font-weight: bold;"
               onmouseover="this.style.color='#339af0'" 
               onmouseout="this.style.color='#74c0fc'">
               📥 Download Front-End Resume
            </a>
        </div>
    </div>
</div>`;
        
        this.addOutput(resumeText, 'resume-section');
        
        setTimeout(() => {
            this.addOutput('', '');
            this.typeText('💡 Choose the resume that best fits the role you\'re considering!', 'info', 40);
        }, 500);
    }
    
    showContact() {
        const contactText = `
<div class="contact-section">
    <div class="help-title">Get In Touch</div>
    <br>
    <p>I'm always interested in new opportunities and collaborations!</p>
    <br>
    <div class="contact-links">
        <a href="mailto:jolina.javier@email.com" class="contact-link">
            <i class="fas fa-envelope"></i> jolina.javier@email.com
        </a>
        <a href="https://linkedin.com/in/jolina-javier" target="_blank" class="contact-link">
            <i class="fab fa-linkedin"></i> LinkedIn Profile
        </a>
        <a href="https://wantedly.com/users/jolina-javier" target="_blank" class="contact-link">
            <i class="fas fa-briefcase"></i> Wantedly Profile
        </a>
        <a href="https://github.com/jolina-javier" target="_blank" class="contact-link">
            <i class="fab fa-github"></i> GitHub Profile
        </a>
    </div>
    <br>
    <p><span class="highlight">Available for:</span> UI/UX Design projects, Front-End Development, Freelance work, and Full-time opportunities.</p>
    <br>
    <p><span class="highlight">Response time:</span> I typically respond within 24 hours.</p>
</div>`;
        this.addOutput(contactText);
    }
    
    clearTerminal() {
        this.output.innerHTML = '';
        this.addOutput('Terminal cleared.', 'success');
    }
    
    whoami() {
        this.addOutput('jolina', 'info');
    }
    
    listDirectory() {
        const files = [
            'about.txt',
            'skills.json',
            'projects/',
            'education.md',
            'contact.vcf',
            'resume.pdf'
        ];
        
        this.addOutput('Directory contents:', 'info');
        files.forEach(file => {
            const isDirectory = file.endsWith('/');
            const color = isDirectory ? 'info' : '';
            this.addOutput(`  ${file}`, color);
        });
    }
    
    printWorkingDirectory() {
        this.addOutput(`/home/jolina${this.currentPath}`, 'info');
    }
    
    showDate() {
        const now = new Date();
        const dateString = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.addOutput(dateString, 'info');
    }
    
    echo(args) {
        const text = args.join(' ');
        this.addOutput(text || '', 'info');
    }
}

// ASCII Art Animation
function animateAsciiArt() {
    const asciiArt = document.querySelector('.ascii-art');
    if (asciiArt) {
        asciiArt.style.opacity = '0';
        setTimeout(() => {
            asciiArt.style.transition = 'opacity 2s ease-in';
            asciiArt.style.opacity = '1';
        }, 500);
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
    animateAsciiArt();
    
    // Add some easter eggs
    const easterEggs = {
        'sudo': () => 'Nice try! But you don\'t have sudo privileges here. 😄',
        'rm -rf /': () => 'Whoa there! Let\'s not delete everything. 😅',
        'hack': () => 'I\'m already in! Just kidding... 🕵️‍♀️',
        'coffee': () => '☕ Here\'s your virtual coffee! Fuel for coding!',
        'matrix': () => 'There is no spoon... 🥄',
        'konami': () => '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️ - You found the Konami code!'
    };
    
    // Add easter eggs to terminal
    const terminal = window.terminal || {};
    Object.assign(terminal, easterEggs);
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
        commandInput.focus();
    }
});

// Prevent context menu on right click for more terminal-like experience
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add some visual effects
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // Add a subtle flash effect when enter is pressed
        const terminal = document.querySelector('.terminal-container');
        terminal.style.boxShadow = '0 20px 40px rgba(0, 255, 0, 0.1)';
        setTimeout(() => {
            terminal.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
        }, 100);
    }
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TerminalPortfolio;
}