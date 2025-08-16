# Jolina Javier - Interactive Portfolio

🌐 **Live Website**: [https://portfolio-roan-eta-47.vercel.app/](https://portfolio-roan-eta-47.vercel.app/)

🎨 A modern, interactive portfolio website for Jolina Javier, showcasing her skills as a UI/UX Designer and Front-End Developer.

## ✨ Features

### 🎭 Interactive Elements
- **Custom Cursor**: Dynamic cursor that responds to hover states
- **Loading Animation**: Elegant loading screen with progress bar
- **Smooth Scrolling**: Seamless navigation between sections
- **Micro-interactions**: Hover effects, button animations, and transitions

### 🎨 Design & Animations
- **Modern Design**: Clean, professional layout with playful elements
- **Dark/Light Theme**: Toggle between light and dark modes
- **Parallax Effects**: Floating elements with scroll-based animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Transitions**: CSS animations and JavaScript-powered effects

### 📱 Sections

#### 🏠 Hero Section
- Animated introduction with typewriter effect
- Floating technology icons (Figma, HTML, CSS, JavaScript)
- Call-to-action buttons with hover effects
- Scroll indicator with bounce animation

#### 👤 About Modal
- Interactive popup with personal information
- Design philosophy and skills showcase
- Smooth modal animations
- Accessibility-friendly focus management

#### 💼 Projects Gallery
- Interactive project cards with hover effects
- Detailed project modals with:
  - Project descriptions
  - Technologies used
  - Key features
  - Challenges and solutions
- Staggered animations on scroll

#### 📄 Resume Section
- PDF download functionality
- Quick preview modal
- Professional presentation

#### 📞 Contact
- Animated contact form
- Social media links with hover effects
- Form validation and submission feedback
- Notification system

### 🛠️ Technical Features
- **Vanilla JavaScript**: No framework dependencies
- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Custom Properties**: Theme system with CSS variables
- **Intersection Observer**: Scroll-based animations
- **Local Storage**: Theme preference persistence
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance Optimized**: Throttled scroll events and efficient animations

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Python 3.x (for local development server)

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd portfolio
   ```

2. **Start a local development server**
   ```bash
   # Using Python (recommended)
   python3 -m http.server 9000
   
   # Or using Node.js serve
   npx serve . -p 3000
   
   # Or using any other static file server
   ```

3. **Open in browser**
   - Navigate to `http://localhost:9000` (or your chosen port)
   - The portfolio will load with the animated loading screen

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🎯 Key Interactions

### Navigation
- **Smooth Scrolling**: Click navigation links for smooth section transitions
- **Mobile Menu**: Hamburger menu for mobile devices
- **Theme Toggle**: Switch between light and dark themes

### Modals
- **About Modal**: Click "Get to know me" button
- **Contact Modal**: Click "Send Message" button
- **Project Details**: Click on any project card
- **Resume Preview**: Click "Quick View" in resume section

### Animations
- **Scroll Animations**: Elements fade in as you scroll
- **Hover Effects**: Interactive elements respond to mouse hover
- **Loading Sequence**: Animated loading screen on page load
- **Floating Elements**: Parallax effect on hero section icons

## 🎨 Customization

### Colors
The portfolio uses CSS custom properties for easy theme customization:

```css
:root {
  --primary-color: #6366f1;     /* Main brand color */
  --secondary-color: #ec4899;   /* Accent color */
  --accent-color: #10b981;      /* Success/highlight color */
  /* ... more variables in styles.css */
}
```

### Content
- **Personal Information**: Update in `index.html`
- **Projects**: Modify project data in `script.js` (`getProjectData` function)
- **Social Links**: Update URLs in `getSocialLink` function
- **Resume**: Replace placeholder with actual resume file

### Animations
- **Timing**: Adjust animation durations in CSS variables
- **Effects**: Modify or add new animations in `styles.css`
- **Interactions**: Customize JavaScript behaviors in `script.js`

## 📱 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Features**: CSS Grid, Flexbox, Custom Properties, Intersection Observer

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Readers**: Semantic HTML and ARIA labels
- **Focus Management**: Proper focus handling in modals
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Supports high contrast mode

## 🔧 Performance

- **Optimized Animations**: Hardware-accelerated CSS transforms
- **Throttled Events**: Scroll and resize events are throttled
- **Efficient DOM**: Minimal DOM manipulation
- **Lazy Loading**: Images and content loaded as needed

## 📄 License

This project is created for Jolina Javier's personal portfolio. Feel free to use as inspiration for your own portfolio projects.

## 🤝 Contributing

This is a personal portfolio project. If you find bugs or have suggestions for improvements, feel free to:

1. Report issues
2. Suggest enhancements
3. Submit pull requests

## 📞 Contact

For questions about this portfolio or to get in touch with Jolina:

- **Email**: jolina.javier@email.com
- **LinkedIn**: [Jolina Javier](https://linkedin.com/in/jolina-javier)
- **GitHub**: [jolina-javier](https://github.com/jolina-javier)
- **Wantedly**: [Jolina Javier](https://wantedly.com/users/jolina-javier)

---

**Built with ❤️ by Jolina Javier**

*Designed and developed with modern web technologies and a focus on user experience.*