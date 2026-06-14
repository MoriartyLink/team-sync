# Team Sync - User Manual

Welcome to **Team Sync** (Team Availability Matrix)! This guide will help you understand how to use the application to effortlessly coordinate schedules with your team.

---

## 1. Getting Started

### Creating an Account & Logging In
1. Navigate to the application URL.
2. If you are a new user, enter your Email Address and Password, then click **Sign Up**. (You can toggle between Sign In and Create Account at the bottom of the form).
3. If you already have an account, enter your credentials and click **Sign In**.

### Onboarding (First-Time Setup)
Upon your first login, you will go through a quick 3-step setup process:
1. **Identity**: Enter your **Full Name**.
2. **Function**: Select your **Current Role** (e.g., Product, Engineering, Design).
3. **Access**: Enter your **Team Access Code**. This code links you to your specific group. *Only members with the exact same access code can see each other's availability.* (e.g., `ALPHA-9`).

---

## 2. The Dashboard (Matrix View)

The Dashboard is your main hub for viewing and updating availability.

### Painting Your Free Time
- **To mark yourself as available (Free)**: Click on a specific time slot in your row. 
- **To mark multiple hours**: Click and drag horizontally across the grid.
- **To remove availability**: Click (or click and drag) over time slots that are currently marked as "Free" to clear them.
- *Note: You can only edit your own schedule. Your row will always be highlighted.*

### Navigation & Views
- **Day/Week View**: Toggle between a daily view and a weekly view using the buttons in the top right.
- **Time Format**: Click the `12H`/`24H` button in the top navigation bar to switch your preferred time format.
- **Change Dates**: Use the `<` and `>` arrows next to the current date to navigate backward or forward in time. 
- **Month Calendar**: Open the sidebar (desktop) or click the calendar icon (mobile) to jump to a specific date quickly.

### Filtering the View
- Use the **Members** column on the left to filter the matrix. 
- Click the circle next to a user's name to hide/show their schedule.
- Click **All** or **None** at the top of the Members column to quickly select or deselect everyone.

---

## 3. Analysis & Alignment Engine

When you need to schedule a meeting, the Analysis view does the heavy lifting for you.

Click the **Bar Chart icon** (📊) in the top navigation bar to access Insights.

### Target Members
- On the left side, select the specific team members who are required for the meeting. The analysis will instantly update based on your selection.

### Optimal Time Slots
- The system automatically calculates and ranks the top 5 time slots where the most selected members are available.

### Alignment Engine
- Use the dropdown to select a specific 1-hour window.
- The engine will explicitly list who is **Free (Synched)** and who is **Busy** during that time.
- **Dispatch Comm**: If there is alignment, a button will appear allowing you to automatically draft an email (via your default email client) to all available members, requesting confirmation for that time slot.

---

## 4. Settings & Profile

To update your account information, click the **Settings icon** (⚙️) in the top right corner.

Here you can update:
- **Full Name**
- **Current Role**
- **Avatar URL**: Provide a link to an image to use as your profile picture.
- **Team Access Code**: Change this if you need to migrate to a different team's workspace. *Warning: Changing this immediately removes you from your current team's view.*

Click **Update Protocol** to save your changes.

---

## Tips & Legend

- **Free (Solid Blue)**: The user is available during this time.
- **Optimal (Dashed Blue outline)**: This indicates a highly recommended time slot where the majority (70%+) of the selected team members are available.
- **Locked/Busy (Empty/Dim)**: The user has not marked this time as free.
