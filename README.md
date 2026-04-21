# StudyGen - Smart Study Schedule Generator

A fully functional and responsive web application designed to help students manage their study schedules, track progress, and organize study materials efficiently.

## Features

### 🔐 Authentication System
- **User Registration & Login**: Secure authentication using localStorage
- **Session Management**: Persistent login with "Remember Me" option
- **User Profiles**: Personalized experience with user-specific data

### 📅 Task Management
- **Add/Edit/Delete Tasks**: Comprehensive task management with priority levels
- **Subject Categorization**: Organize tasks by subject (Physics, Math, Chemistry, etc.)
- **Due Dates**: Set deadlines and track overdue tasks
- **Task Status**: Mark tasks as complete with visual indicators
- **Priority Levels**: High, Medium, and Low priority with color coding

### 📊 Dashboard
- **Today's Tasks**: Quick view of tasks due today
- **Overdue Alerts**: Highlighted overdue tasks
- **Progress Tracking**: Real-time progress bar showing completion percentage
- **Upcoming Tasks**: Preview of tasks due in the next few days
- **Calendar Integration**: Embedded Google Calendar

### 📈 Analytics
- **Performance Trends**: Weekly completion rate charts
- **Subject Distribution**: Pie chart showing time spent on each subject
- **Completion Rates**: Bar chart comparing completed vs pending tasks
- **Daily Activity**: Track completed tasks over the last 7 days
- **Productivity Stats**: Overview cards showing key metrics

### 📚 Study Materials
- **Add Materials**: Upload/link study resources with descriptions
- **Subject Categorization**: Organize materials by subject
- **Search & Filter**: Find materials quickly with search and filter options
- **External Links**: Add links to online resources
- **Material Management**: Edit and delete materials

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and easy navigation on mobile
- **Adaptive Layouts**: Automatically adjusts to screen size
- **Modern UI**: Beautiful dark theme with vibrant accents

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Dynamic functionality and data management
- **Chart.js**: Data visualization for analytics
- **LocalStorage API**: Client-side data persistence

## Project Structure

```
Hackathon/
├── index.html                 # Entry point (redirects to login/dashboard)
├── HTML/
│   ├── login.html            # Login and registration page
│   ├── dashboard.html        # Main dashboard with overview
│   ├── schedule.html         # Task management page
│   ├── analytics.html        # Analytics and statistics
│   └── study-material.html   # Study materials management
├── CSS/
│   ├── login.css            # Login page styling
│   ├── style.css            # Dashboard styling
│   ├── schedule.css         # Schedule page styling
│   ├── analytics.css        # Analytics page styling
│   └── studymaterial.css    # Study materials styling
└── Javascript/
    ├── auth.js              # Authentication logic
    ├── dashboard.js         # Dashboard functionality
    ├── schedule.js          # Task management logic
    ├── analytics.js         # Analytics data processing
    └── study-material.js    # Study materials management
```

## Getting Started

### Installation

1. Clone or download the project
2. Open `index.html` in a web browser
3. You'll be redirected to the login page

### First Time Use

1. Click "Register here" on the login page
2. Create an account with:
   - Username (required)
   - Email (required)
   - Password (minimum 6 characters)
3. After registration, login with your credentials
4. Start adding tasks and study materials!

### Default Login (for testing)

After creating an account, you can use those credentials to login.

## Usage Guide

### Adding Tasks

1. Navigate to "Schedule Task" from the sidebar
2. Fill in the task form:
   - Task Title (e.g., "Complete Physics Chapter 5")
   - Due Date
   - Priority Level (High/Medium/Low)
   - Subject
3. Click "Add Task"
4. Tasks appear in the list below, sorted by date and priority

### Tracking Progress

1. Check tasks off as you complete them
2. View your progress on the Dashboard
3. The progress bar updates automatically
4. Check Analytics page for detailed statistics

### Managing Study Materials

1. Go to "Study Material" page
2. Add new materials using the form:
   - Title
   - Subject
   - Description
   - Optional: External link
3. Use search bar to find specific materials
4. Filter by subject using the dropdown
5. Click "Open" to access external links
6. Click "Delete" to remove materials

### Viewing Analytics

1. Navigate to "Analytics" page
2. View:
   - Total tasks and completion rate
   - Weekly performance trends
   - Time spent by subject
   - Daily activity over last 7 days

## Features Implemented

✅ Complete login/logout system with authentication  
✅ Task management (add, edit, delete, complete)  
✅ Dynamic progress tracking  
✅ Real-time analytics with charts  
✅ Study material management with search/filter  
✅ Fully responsive design for all devices  
✅ Data persistence using localStorage  
✅ Beautiful modern UI with dark theme  
✅ Overdue task alerts  
✅ Subject-based organization  
✅ Priority-based task sorting  

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## Data Storage

All data is stored locally in your browser using localStorage:
- User accounts and profiles
- Tasks and completion status
- Study materials
- Analytics data

**Note**: Clearing browser data will remove all stored information.

## Future Enhancements (Optional)

- Export tasks and materials to PDF
- Pomodoro timer integration
- Study session tracking
- Collaborative study groups
- Cloud sync across devices
- Dark/Light theme toggle
- Customizable color schemes

## Tips for Best Experience

1. **Set Realistic Goals**: Don't overload your schedule
2. **Use Priorities**: Mark important tasks as High priority
3. **Check Dashboard Daily**: Stay updated on your progress
4. **Organize Materials**: Use clear titles and descriptions
5. **Review Analytics**: Identify patterns in your study habits

## Troubleshooting

### Tasks not appearing?
- Make sure you're logged in
- Check that tasks have valid due dates
- Try refreshing the page

### Analytics not showing data?
- Add and complete some tasks first
- Data accumulates over time for better insights

### Can't login?
- Verify your username and password
- Try registering a new account if forgotten

### Charts not loading?
- Ensure internet connection (Chart.js loads from CDN)
- Try refreshing the page

## Credits

Developed as part of a hackathon project to create a comprehensive study management tool for students.

## License

This project is open source and available for educational purposes.

---

**Made with ❤️ for students by students**
