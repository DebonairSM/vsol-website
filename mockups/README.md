# VSol Dashboard Mockups

This folder contains interactive HTML mockups for the VSol Software dashboard with role-based access control.

## Files

1. **index.html** - Navigation hub to access all mockups
2. **login.html** - Login page with Google OAuth authentication
3. **dashboard-admin.html** - System Administrator dashboard view
4. **dashboard-sales.html** - Sales Representative dashboard view
5. **dashboard-client.html** - Software Client portal view
6. **dashboard-referrer.html** - Referrer portal for tracking referrals
7. **user-management.html** - User management interface (Admin only)
8. **referral-management.html** - Referral tracking by source (Admin/Sales only)

## Features Demonstrated

### Authentication
- Google OAuth login button
- Traditional login form (placeholder for future)
- Security messaging
- Clean, modern design

### Role-Based Dashboards

#### System Admin
- Full metrics overview (users, leads, referrals, system health)
- Recent activity feed
- Quick actions for common admin tasks
- Access to all navigation items including:
  - User Management
  - Audit Logs
  - Database access
  - System Settings

#### Sales Representative
- Sales-focused metrics (active leads, qualified leads, referrals, conversions)
- Sales pipeline visualization
- Recent leads table with filtering
- Quick actions for lead management
- Limited navigation (no user management or admin features)

#### Software Client
- Client-focused view with project tracking
- Active projects with progress bars
- Recent updates feed
- Support ticket access
- Billing information
- Limited navigation (only client-relevant sections)

### Key UI Components

1. **Collapsible Sidebar**
   - Click hamburger menu to collapse/expand
   - Role-based badge displays
   - User profile section
   - Context-aware navigation

2. **Metrics Cards**
   - Color-coded by category
   - Icons for visual clarity
   - Trend indicators
   - Real-time statistics

3. **Data Tables**
   - Sortable columns
   - Filtering options
   - Pagination
   - Action buttons
   - Status badges

4. **Modals**
   - User creation form
   - Form validation (visual)
   - Overlay styling

5. **Navigation**
   - Active state highlighting
   - Icon + text labels
   - Organized by role permissions

## Design System

### Colors
- **Primary (Blue)**: `#2563EB` - Main actions, links
- **Success (Green)**: `#10B981` - Positive states
- **Warning (Yellow)**: `#F59E0B` - Alerts, pending states
- **Danger (Red)**: `#EF4444` - Errors, destructive actions
- **Purple**: `#8B5CF6` - Referrals, special features
- **Gray Scale**: Tailwind's default gray palette

### Role Badge Colors
- **System Admin**: Red (`bg-red-600`)
- **Consultant**: Blue (`bg-blue-600`)
- **Sales Rep**: Green (`bg-green-600`)
- **Client**: Purple (`bg-purple-600`)

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Regular weight, readable sizes
- **Labels**: Uppercase, smaller font for metadata

## Technology Used

- **Tailwind CSS**: Utility-first CSS via CDN
- **Font Awesome**: Icon library
- **Vanilla JavaScript**: For interactive elements (sidebar toggle, modals)
- **UI Avatars API**: Dynamic user avatars

## Viewing the Mockups

Simply open any HTML file in a web browser. All dependencies are loaded via CDN, so no build process is required.

### Navigation Between Pages
- Click "Add User" button on admin dashboard to see the user management page
- Click "Users" in the sidebar to navigate to user management
- Click "Dashboard" in sidebar to return to the main view
- Use the logout links to return to the login page

## Implementation Notes

These mockups demonstrate the design and user experience. For production implementation:

1. Replace CDN links with local assets
2. Implement actual authentication with Google OAuth
3. Connect to backend APIs for real data
4. Add form validation and error handling
5. Implement proper routing
6. Add loading states and skeleton screens
7. Include accessibility features (ARIA labels, keyboard navigation)
8. Add responsive mobile menu
9. Implement dark mode toggle
10. Add proper security measures

## Responsive Design

All mockups are responsive and work on:
- Desktop (1024px+)
- Tablet (768px-1023px)
- Mobile (below 768px)

The sidebar automatically collapses on smaller screens.

## Next Steps

To implement this design in your VSol website:

1. Review and approve the mockups
2. Create database schema for users and roles
3. Implement Google OAuth authentication
4. Build backend API endpoints with RBAC
5. Convert mockups to React/Vue components (or use your preferred framework)
6. Integrate with existing VSol website backend
7. Add testing (unit, integration, E2E)
8. Deploy to staging for review
9. Conduct security audit
10. Deploy to production

## Feedback

Please review these mockups and provide feedback on:
- Layout and design
- Color scheme
- Navigation structure
- Feature completeness
- Any missing functionality
- User experience concerns


