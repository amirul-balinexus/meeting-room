# Meeting Room Calendars - Native Version

This is a native HTML/CSS/JavaScript implementation of the Meeting Room Calendars application, built without any frameworks or build tools.

## Features

-   **Home Page**: Grid layout of meeting rooms with hover effects
-   **Room Pages**: Full-screen Google Calendar integration for each room
-   **Responsive Design**: Works on desktop, tablet, and mobile devices
-   **Client-side Routing**: Browser back/forward button support
-   **Auto-refresh**: Calendars refresh every 5 minutes
-   **Fullscreen Mode**: Dedicated fullscreen view for each room
-   **Direct URL Access**: Can navigate directly to room URLs
-   **Dynamic Room Management**: Add, update, and manage rooms programmatically

## File Structure

```
native/
├── index.html      # Main HTML file
├── styles.css      # All CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## How to Use

1. **Open `index.html`** in any modern web browser
2. **No build process required** - just open the file directly
3. **No dependencies** - pure HTML, CSS, and JavaScript

## Room Configuration

The rooms are configured in `script.js`:

-   **Agung Room**: 1st Floor (Purple theme)
-   **Bali Room**: 2nd Floor (Red theme)
-   **Java Room**: 3rd Floor (Green theme)

Each room uses the same Google Calendar ID but with different colors and titles.

## Browser Compatibility

-   Chrome 60+
-   Firefox 55+
-   Safari 12+
-   Edge 79+

## Features Explained

### Client-side Routing

-   Uses `window.history.pushState()` for navigation
-   Handles browser back/forward buttons
-   Updates URL without page reload

### Auto-refresh

-   Calendars refresh every 5 minutes (300,000ms)
-   Timer automatically starts/stops when navigating between pages
-   Prevents memory leaks by clearing intervals

### Fullscreen Mode

-   Creates a new iframe overlay for true fullscreen
-   Includes close button for easy exit
-   Maintains room-specific styling

### Responsive Design

-   Mobile-first CSS approach
-   Grid layout adapts to screen size
-   Touch-friendly button sizes on mobile

## Customization

### Adding New Rooms

1. Add room config to `roomConfigs` in `script.js`
2. Add room card HTML in `index.html`
3. Add room color CSS in `styles.css`

### Changing Colors

-   Modify the CSS variables in `styles.css`
-   Update the `buttonColor` property in room configs

### Calendar Settings

-   Modify the `buildCalendarUrl()` function in `script.js`
-   Change timezone, view mode, or other Google Calendar parameters

## Performance Notes

-   **No bundle size**: Minimal file sizes
-   **Fast loading**: No build step or dependencies
-   **Efficient DOM**: Minimal DOM manipulation
-   **Memory management**: Proper cleanup of timers and event listeners

## Security Considerations

-   **Same-origin policy**: Iframe content from Google Calendar
-   **No external scripts**: All code is local
-   **No data storage**: No cookies or localStorage used

## Troubleshooting

### Calendar Not Loading

-   Check internet connection
-   Verify Google Calendar ID is correct
-   Ensure browser allows iframe content

### Styling Issues

-   Clear browser cache
-   Check CSS file path in HTML
-   Verify browser supports CSS Grid and Flexbox

### JavaScript Errors

-   Open browser console (F12) to see error messages
-   Ensure all files are in the same directory
-   Check for syntax errors in browser console
