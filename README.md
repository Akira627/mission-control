# Mission Control Dashboard

A real-time monitoring dashboard for OpenClaw agent systems, built with HTML5, Tailwind CSS, and JavaScript.

## Features

- **Real-time Agent Monitoring**: Track status, CPU, memory, and activity of all agents
- **System Health Metrics**: Visual indicators for system performance and uptime
- **Activity Charts**: 24-hour system activity visualization
- **Alert Management**: Recent alerts with severity levels and timestamps
- **Quick Actions**: One-click controls for common operations
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
mission-control/
├── index.html          # Main dashboard HTML file
├── README.md           # Project documentation
├── .gitignore          # Git ignore file
└── assets/             # Static assets (optional)
    ├── css/
    ├── js/
    └── images/
```

## Technologies Used

- **HTML5**: Semantic markup structure
- **Tailwind CSS v3**: Utility-first CSS framework via CDN
- **Font Awesome 6**: Icon library for UI elements
- **Vanilla JavaScript**: Lightweight interactivity without frameworks
- **Glassmorphism Design**: Modern UI with translucent elements

## Getting Started

### Option 1: Direct File Access
Simply open `index.html` in any modern web browser.

### Option 2: Local Development Server
For better development experience, use a local server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js with http-server
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

### Option 3: Integration with OpenClaw
This dashboard can be served as part of an OpenClaw deployment:

1. Place the `mission-control` folder in your OpenClaw web directory
2. Configure your web server to serve the dashboard
3. Integrate with OpenClaw APIs for real data (see "API Integration" below)

## Customization

### Colors and Theme
The dashboard uses a dark theme with customizable accent colors. Modify the CSS variables in the `<style>` section of `index.html`:

```css
:root {
    --primary-color: #3b82f6;    /* Blue */
    --secondary-color: #10b981;  /* Green */
    --accent-color: #8b5cf6;     /* Purple */
    --dark-bg: #0f172a;          /* Dark background */
    --card-bg: #1e293b;          /* Card background */
}
```

### Agent Configuration
To add or modify agents, update the table in the "Agent Status" section. Each agent should have:

- Name and description
- Status indicator (online/warning/offline)
- Resource usage (CPU, memory)
- Last activity timestamp

### Alert System
Alerts are color-coded by severity:
- 🔴 **Red**: Critical issues requiring immediate attention
- 🟡 **Yellow**: Warnings that should be monitored
- 🔵 **Blue**: Informational messages
- 🟢 **Green**: Success/positive notifications

## API Integration (Future Enhancement)

For real data integration with OpenClaw, you would need to:

1. **Set up API endpoints** in OpenClaw to expose agent status
2. **Create a JavaScript fetch** to pull data periodically
3. **Update the DOM** with real-time information

Example API integration snippet:

```javascript
// Fetch agent status from OpenClaw API
async function fetchAgentStatus() {
    try {
        const response = await fetch('/api/agents/status');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Failed to fetch agent status:', error);
    }
}

// Update dashboard with real data
function updateDashboard(agentData) {
    // Update agent table
    // Update metrics
    // Update charts
}

// Poll every 10 seconds
setInterval(fetchAgentStatus, 10000);
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- No external dependencies beyond CDN resources
- Minimal JavaScript for better performance
- Optimized for 60fps animations and transitions
- Responsive images and lazy loading ready

## Deployment

### Static Hosting
Deploy to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

### Docker Container
Create a Docker container for easy deployment:

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) for the amazing utility-first CSS framework
- [Font Awesome](https://fontawesome.com) for the comprehensive icon library
- [OpenClaw](https://openclaw.ai) for the agent system inspiration
- Glassmorphism design trend for the modern UI aesthetics

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check the [OpenClaw documentation](https://docs.openclaw.ai)
- Join the [OpenClaw Discord community](https://discord.com/invite/clawd)

---

**Dashboard Version**: 1.0.0  
**Last Updated**: February 2026  
**OpenClaw Compatibility**: v2.4+