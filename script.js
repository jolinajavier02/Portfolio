// Terminal Portfolio JavaScript

class TerminalPortfolio {
    constructor() {
        this.commandInput = document.getElementById('commandInput');
        this.output = document.getElementById('output');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '~';
        
        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            skills: this.showSkills.bind(this),
            projects: this.showProjects.bind(this),
            education: this.showEducation.bind(this),
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
    
    init() {
        this.commandInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.commandInput.focus();
        
        // Show welcome message with typing effect
        setTimeout(() => {
            this.typeText('Type "help" to see available commands.', 'info');
        }, 1000);
        
        // Keep input focused
        document.addEventListener('click', () => {
            this.commandInput.focus();
        });
    }
    
    handleKeyDown(e) {
        switch(e.key) {
            case 'Enter':
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
        
        let i = 0;
        const typeInterval = setInterval(() => {
            div.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, delay);
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
        const aboutText = `
<div class="about-section">
    <div class="help-title">About Jolina Javier</div>
    <p>Hello! I'm a passionate UI/UX Designer and Front-End Developer with a keen eye for creating intuitive and beautiful digital experiences.</p>
    <br>
    <p><span class="highlight">Background:</span> I combine creativity with technical skills to bridge the gap between design and development.</p>
    <br>
    <p><span class="highlight">Philosophy:</span> I believe great design should be invisible - it should feel natural and effortless to users while solving real problems.</p>
    <br>
    <p><span class="highlight">Approach:</span> User-centered design thinking combined with modern development practices to create meaningful digital solutions.</p>
    <br>
    <p><span class="highlight">Interests:</span> UI/UX Design, Front-End Development, User Research, Accessibility, and emerging web technologies.</p>
</div>`;
        this.addOutput(aboutText);
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