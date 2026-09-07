# Admin Dashboard - Contacts Management Guide

## Overview
The admin dashboard now includes a complete **Contacts Management** system to handle website contact form submissions from the "Get In Touch" page.

## Features

### 1. **Dashboard Overview**
- **KPI Card**: Shows unread contact count with total submissions
- **Quick Access**: Click the card to navigate to the full Contacts section
- **Real-time Updates**: Stats refresh automatically every 15 seconds

### 2. **Contacts Section**
The Contacts section is accessible from the admin sidebar under the "Content" group.

#### Statistics Display
```
┌─────────────────────────────┐
│ Total Submissions: 42        │
│ Unread Messages: 5           │
└─────────────────────────────┘
```

#### Contact List View
Each contact submission displays:
- **Name** - Visitor's name with submission date
- **Email** - Visitor's email address
- **Phone** - Contact phone number
- **Subject** - Message subject line
- **Message** - Preview of the message (80 characters)
- **Status** - Read/New indicator badge
- **Actions** - Mark as read or delete buttons

### 3. **Contact Status Management**

#### New (Unread) Contacts
- Highlighted with orange left border
- Light orange background (#FFFBF0)
- "New" badge in red (#FEE2E2)
- Mark as read button available

#### Read Contacts
- Normal background
- "Read" badge in gray
- Opacity slightly reduced

### 4. **Actions Available**

#### Mark as Read
- **Icon**: Check mark button
- **Purpose**: Mark contact as reviewed
- **Access**: Only available for unread messages
- **Updates**: Dashboard stats refresh automatically

#### Delete Contact
- **Icon**: Trash icon button
- **Purpose**: Remove contact from database
- **Confirmation**: Shows confirmation dialog
- **Updates**: Total count and stats update immediately

## Navigation

### Accessing Contacts
1. Log in to admin dashboard
2. Locate "Content" section in sidebar
3. Click "Contacts" button
4. View all submissions with unread count badge

### From Dashboard
1. Look for "Contact Messages" KPI card (pink icon)
2. Click on the card to jump to Contacts section
3. Shows unread count as primary metric

## Technical Details

### Frontend Components
- **Hook**: `useContacts()` - Fetches contact submissions
- **Hook**: `useContactStats()` - Fetches dashboard statistics
- **Hook**: `useContactMutations()` - Handles mark as read and delete actions
- **Route**: Sidebar navigation item with unread badge

### API Endpoints Used
```
GET  /api/contacts?page=1&limit=20          - Fetch contacts list
GET  /api/contacts/dashboard/stats           - Get statistics
PUT  /api/contacts/{id}/mark-read            - Mark as read
DELETE /api/contacts/{id}                    - Delete contact
```

### CSS Classes
- `.admin-review-card-item.unread` - Styling for unread messages
- `.admin-kpi-icon-wrap.bg-msg` - KPI card icon styling (pink)
- `.admin-nav-badge.badge-orange` - Unread count badge

## Workflow Example

### Scenario: Handling a New Contact

1. **Admin logs in** → Dashboard shows "Contact Messages: 3 unread"
2. **Admin clicks** the Contact Messages KPI card
3. **Contacts page loads** with list showing 3 unread (highlighted in orange)
4. **Admin reviews** the first unread message
5. **Admin clicks** ✓ (check mark) to mark as read
6. **Stats update** → "Contact Messages: 2 unread" on dashboard
7. **Admin deletes** old/spam messages using trash icon
8. **Database syncs** → Total count updates

## Responsive Design

### Desktop (1024px+)
- 7 columns: Name | Email | Phone | Subject | Message | Status | Action
- Full table view with all information visible

### Tablet (768px-1023px)
- 4 columns layout
- Adjusted spacing and font sizes
- Mobile labels appear for clarity

### Mobile (< 768px)
- 1 column layout
- Stacked card view
- Mobile labels show field names
- Touch-friendly buttons

## Unread Message Indicators

### Visual Cues
1. **Left Border**: Orange (#EA580C) 4px border on left
2. **Background**: Light cream (#FFFBF0)
3. **Font Weight**: Bolder text for name
4. **Badge**: Red "New" status badge
5. **Opacity**: Full opacity (1.0) vs 0.8 for read

### Unread Count Badge
- Location: Sidebar "Contacts" button
- Color: Orange (#F59E0B)
- Updates: Real-time via React Query

## Data Persistence

### Database
- All contacts stored in PostgreSQL
- Fields: id, name, email, phone, subject, message, isRead, createdAt, updatedAt
- Indexed on: email, createdAt, isRead

### Caching
- React Query caches contacts list
- Auto-refresh every 30 seconds (staleTime)
- Invalidates on mutation (mark read/delete)

## Security

### Access Control
- ✅ Requires admin authentication
- ✅ Admin role validation
- ✅ All endpoints protected with requireAuth + requireAdmin

### Data Safety
- Confirmation dialog before deletion
- No bulk delete (protects against accidental loss)
- Database transaction support on backend

## Future Enhancements

Potential features to add:
- [ ] Email notifications for new contacts
- [ ] CSV export of contact submissions
- [ ] Reply to contact with email integration
- [ ] Contact form analytics dashboard
- [ ] Tags/labels for organizing contacts
- [ ] Auto-response email sending
- [ ] Contact search functionality
- [ ] Bulk actions (select multiple)

## Troubleshooting

### Contacts Not Loading?
- Check API health: `/api/health`
- Verify admin authentication token
- Check browser console for API errors
- Ensure backend is running

### Stats Not Updating?
- Refresh page (Ctrl+R)
- Check React Query DevTools
- Verify staleTime settings
- Look for API 401/403 errors

### Unread Count Wrong?
- Mark contacts as read properly
- Refresh dashboard stats
- Check database directly via admin query
- Verify no concurrent updates

## Admin Tips

✅ **Best Practices**
- Review contacts daily
- Delete spam immediately
- Mark legitimate contacts as read
- Export important messages for records
- Check for patterns in spam contacts

⚠️ **Important Notes**
- Deleted contacts cannot be recovered
- Read status is for organization only
- No automatic replies configured (manual follow-up)
- Contact form is public - moderate spam regularly

## Support

For issues or questions:
1. Check admin panel health indicators
2. Review API response in network tab
3. Verify database connection
4. Check server logs for errors
