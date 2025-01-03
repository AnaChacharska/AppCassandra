# Changelog

All notable changes to this project will be documented in this file.



### **New Features**
- **Static Data Fetching for Leaves**:
    - Implemented `getStaticProps` to prefetch leaves data from the Xano API at build time.
    - Added logic to handle paginated API responses during static generation.
    - Ensured robust error handling to fall back to an empty dataset if API fetching fails.

- **Dynamic Data Fetching with `useEffect`**:
    - Integrated dynamic data fetching to load leaves data when pre-fetched data is unavailable or incomplete.
    - Implemented caching for API responses to minimize redundant network requests.
    - Added an exponential backoff mechanism to gracefully handle rate-limited requests.
    - Synced the `leaves` state with progressively loaded data for a smoother user experience.

- **Fetch Single Record by ID**:
    - Added a `useEffect` hook to fetch individual records by ID from the Xano API.
    - Included a retry mechanism with exponential backoff for handling rate-limiting issues.
    - Enhanced error handling with clear error messages and fallback states.

- **Dark Mode Preference**:
    - Implemented `useEffect` to retrieve and apply dark mode preferences saved in local storage.
    - Ensured consistent theming across sessions based on user preference.

### **Performance Enhancements**
- Optimized API calls for leaves and single record fetching:
    - Reduced redundant requests using caching.
    - Minimized API throttling issues with batched requests and exponential backoff.
    - Improved data loading speed during static generation by handling pagination efficiently.

### **Error Handling**
- Added robust error handling for all API calls:
    - Display user-friendly error messages for failed data fetching.
    - Logged detailed error messages for debugging purposes.
    - Ensured fallback states to prevent application crashes.

### **State Management Improvements**
- Enhanced form state management for adding, editing, and deleting records in Xano.
- Improved `GlobalContext` with better state management practices for shared data.
- Refactored `_app.js` to include `DarkModeProvider` and `GlobalProvider` for global state and theme management.

### **Miscellaneous**
- Added comprehensive logging to debug API calls and verify functionality.
- Updated components to display loading indicators and handle loading states gracefully.
- Refactored components to ensure better code readability and maintainability.

---


