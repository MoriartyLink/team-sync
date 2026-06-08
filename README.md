# Team Sync App - User Manual

The **Team Sync App** (Availability Matrix) is a real-time scheduling tool designed to help teams effortlessly find overlapping free time. With an intuitive drag-to-toggle interface and a powerful analysis engine, coordinating your team has never been smoother.

---

## 🧭 Navigation & Features

### 1. Dashboard (Matrix View)
The Dashboard is your main hub for managing and viewing availability.
*   **Time Grid:** View the schedule in **Day** or **Week** mode.
*   **Drag to Toggle:** Simply click and drag across the grid cells to mark yourself as available or busy. The interface updates instantly for a buttery-smooth experience while syncing with the server in the background.
*   **Time Format:** Toggle between 12-hour and 24-hour time formats using the top navigation bar.
*   **Team Filtering:** Click on team members in the left-hand column to filter the grid and see specific overlaps.

### 2. Analysis View
*Accessible via the Bar Chart icon in the top navigation bar.*

The Analysis view provides a dedicated, distraction-free environment to calculate the best meeting times.
*   **Target Members:** Select or deselect specific team members directly from the left sidebar to focus your analysis.
*   **Alignment Engine:** Pick a specific hour using the custom dropdown menu to see exactly who is "Free" and who is "Busy" at that time.
*   **Optimal Time Slots:** Automatically calculates and ranks the top 5 best times to meet based on the maximum overlapping availability of your selected Target Members.

### 3. Profile & Settings
*Accessible via the Sliders icon in the top navigation bar.*
*   **Profile Customization:** Update your Full Name, Current Role, and Avatar URL to personalize your presence on the grid.
*   **Team Access Code:** Switch to a different shared network by updating your Team Code. *(Warning: This changes the group of users you see and share availability with).*

---

## 🛠️ Getting Started (Local Development)

**Prerequisites:** Node.js v18+ recommended.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Make sure you have your `.env` file set up with the necessary Supabase and Firebase configuration keys (if applicable to your current backend setup).
   *(You can use `.env.example` as a template).*

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔒 Admin Features
*(For authorized administrators only)*
The application includes an Admin Dashboard (`/admin`) to manage team access codes, monitor overall usage statistics, and control user visibility across the platform.