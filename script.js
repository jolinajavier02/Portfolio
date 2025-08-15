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
        const skillsText = `
<div class="skills-section">
    <div class="help-title">Technical Skills & Tools</div>
    <br>
    <div class="skills-grid">
        <div class="skill-item">
            <i class="fab fa-html5"></i>
            <span>HTML5</span>
        </div>
        <div class="skill-item">
            <i class="fab fa-css3-alt"></i>
            <span>CSS3</span>
        </div>
        <div class="skill-item">
            <i class="fab fa-js-square"></i>
            <span>JavaScript</span>
        </div>
        <div class="skill-item">
            <i class="fab fa-react"></i>
            <span>React</span>
        </div>
        <div class="skill-item">
            <i class="fab fa-figma"></i>
            <span>Figma</span>
        </div>
        <div class="skill-item">
            <i class="fab fa-github"></i>
            <span>GitHub</span>
        </div>
        <div class="skill-item">
            <i class="fas fa-code"></i>
            <span>VS Code</span>
        </div>
    </div>
    <br>
    <p><span class="highlight">Design:</span> UI/UX Design, Prototyping, Wireframing, User Research</p>
    <p><span class="highlight">Development:</span> Responsive Design, Modern JavaScript, React, CSS Frameworks</p>
    <p><span class="highlight">Tools:</span> Figma, Adobe Creative Suite, Git, VS Code, Browser DevTools</p>
</div>`;
        this.addOutput(skillsText);
    }
    
    showProjects() {
        const projects = [
            { name: 'Broccobae', url: 'https://www.broccobae.com/', description: 'Vegan recipe destination website' },
            { name: 'CalDef', url: 'https://jolinajavier02.github.io/Caldef/', description: 'Calorie deficit tracker application' },
            { name: 'Coffee App', url: 'https://jolinajavier02.github.io/Coffee-App/', description: 'Coffee ordering experience prototype' },
            { name: 'Globetrone Bank App', url: 'https://jolinajavier02.github.io/Globetrone-Bank-App/', description: 'Banking app for international users' },
            { name: 'Globetrone Case Study', url: 'https://jolinajavier02.github.io/Globetrone-Case-Study/', description: 'Complete case study and prototype' }
        ];
        
        this.addOutput('Projects Portfolio:', 'help-title');
        this.addOutput('', '');
        
        projects.forEach((project, index) => {
            const projectLine = `${index + 1}. <a href="${project.url}" target="_blank" class="project-link">${project.name}</a> -> ${project.description}`;
            setTimeout(() => {
                this.typeText(projectLine, 'project-item', 30);
            }, index * 200);
        });
        
        setTimeout(() => {
            this.addOutput('', '');
            this.typeText('💡 Click on any project name to open it in a new tab', 'info', 40);
        }, projects.length * 200 + 500);
    }
    
    showEducation() {
        const educationText = `
<div class="education-section">
    <div class="help-title">Educational Background</div>
    <br>
    <div class="education-item">
        <div class="education-title">Google UX Design Certificate</div>
        <div class="education-description">Comprehensive program covering UX research, design thinking, prototyping, and usability testing.</div>
        <div class="education-year">2023</div>
    </div>
    <br>
    <div class="education-item">
        <div class="education-title">CalArts UI/UX Design Specialization</div>
        <div class="education-description">Specialized coursework in visual design, user interface design, and user experience principles.</div>
        <div class="education-year">2022</div>
    </div>
    <br>
    <div class="education-item">
        <div class="education-title">Bachelor of Science in Hospitality Management</div>
        <div class="education-description">Foundation in customer service, project management, and business operations.</div>
        <div class="education-year">2020</div>
    </div>
    <br>
    <p><span class="highlight">Continuous Learning:</span> Staying updated with latest design trends, development frameworks, and industry best practices through online courses and workshops.</p>
</div>`;
        this.addOutput(educationText);
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