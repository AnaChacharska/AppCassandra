# AppCassandra

## Cassandra Leaves Dashboard

### Overview
The Cassandra Leaves Dashboard is a web application designed to manage records effectively. It allows users to search, add, edit, and delete records with a user-friendly interface. The application is styled beautifully with a transparent background image overlay for aesthetic appeal.

### Features

#### Search Functionality
- Users can search records by title using the search bar.
- Results update dynamically as the user types.

#### Add New Records
- A form allows users to add new records with fields for Title and Domain.
- Records are displayed in the table once added.

#### Edit Records
- Users can edit existing records by clicking the "Edit" button.
- The form is pre-filled with the record's details for easy editing.

#### Delete Records
- Users can delete records by clicking the "Delete" button.
- Deleted records are removed immediately, with a success message displayed.

#### Pagination
- Records are paginated, displaying 10 items per page.
- Users can navigate between pages using "Previous" and "Next" buttons.

#### Detailed Record View
- Clicking the "View" button for a record navigates to a dedicated details page.
- The details page displays:
  - ID, Title, and Domain.
  - Full content rendered with HTML.
  - Tags, Language, MIME Type, and HTTP Status.
  - Publishing information such as Published By and Source URL.
  - Preview Picture.
  - Metadata like Wallabag creation and update timestamps.
  - User information (Name and Email).
- Styled with a modern and responsive design, including a transparent background image overlay.

#### Responsive Design
- The application is styled with a blend of modern CSS for a visually appealing and responsive design.

### Assumptions
- The initial dataset (`leavesData`) is passed as a prop from the server-side.
- IDs for new records are generated sequentially based on the current dataset.
- Deletion and addition of records affect only the local state (no persistent storage).
- Each record has a unique ID, Title, and Domain.

### How to Run the Application

#### Prerequisites
- Ensure you have Node.js installed.
- Install a package manager such as npm or yarn.

#### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url/cassandra-leaves-dashboard.git
   cd cassandra-leaves-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Add the initial dataset:
   - Create a `data` folder in the root directory.
   - Add a `leaves.json` file with sample data in the following format:
     ```json
     [
         { "id": 1, "title": "Leaf Record 1", "domain_name": "Domain 1" },
         { "id": 2, "title": "Leaf Record 2", "domain_name": "Domain 2" }
     ]
     ```

#### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
2. Open the application in your browser:
   ```
   http://localhost:3000
   ```

#### Building for Production
To build and serve the application in production mode:
```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Technologies Used
- **React.js**: For building the user interface.
- **Next.js**: For server-side rendering and static site generation.
- **CSS-in-JS**: For styling the components using the `jsx` style block.

### Enhancements with the Detailed Page
- **Dedicated Details Page**: A new page displays full details of a selected record, enhancing usability and providing a comprehensive view of each record.
- **Dynamic Routing**: Utilizes Next.js `getStaticPaths` and `getStaticProps` for efficient and pre-rendered detail pages.
- **Enhanced Styling**: Aligns with the main dashboard style, ensuring a consistent and visually appealing user experience.

### Notes
- Currently, all data operations are stored in the local state. No backend database or persistent storage is implemented.
- The details page dynamically renders all record attributes, ensuring full visibility of the record's metadata.

