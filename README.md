# YouDo - Secure and User-Friendly To-Do List

YouDo is a secure and user-friendly to-do list application designed to help you efficiently manage your tasks. With a focus on a clean UI and robust functionality, YouDo provides a seamless task management experience.

## Features

- **CRUD Operations:** Add, edit, and delete tasks with ease.
- **Multi-User Support:** Secure signup and login functionality for personalized task management.
- **Robust Security:**
  - Password hashing for secure storage.
  - Token-based sessions with rotation of both Access and Refresh Tokens.
  - Middleware authentication to protect API endpoints.
- **Task Management:**
  - Mark tasks as complete.
  - Delete tasks individually or in bulk.
  - Protection against task duplication.
- **Password Recovery:** Forget password functionality with email-based password reset.
- **Real-Time ISS Location:** A dedicated page to track and display the International Space Station's location on a map in real time.

## Technologies Used

- **Frontend:**
  - Vite
  - React.js
  - React-leaflet
  - React-Router-dom
  - Axios
  - Bootstrap
- **Backend:**
  - Express.js
  - MongoDB
  - Maildev

## Installation

1.  Clone the repository: `git clone <repository_url>`
2.  Open the project in your IDE (e.g., VS Code).
3.  Install dependencies:
    - In the `./backend` directory: `npm install`
    - In the `./src` directory: `npm install`
4.  Run the backend servers:
    - In the `./backend` directory: `npm run dev` and `npm run devAuth` (in separate terminals)
5.  **Run Maildev (for local email testing):**
    - Open a new terminal and run: `maildev`
6.  Run the frontend:
    - In the `./src` directory: `npm run dev`

## Usage

1.  Navigate through the application using the Navbar.
2.  Go to the "To-Do List" section.
3.  Signup or login with your credentials.
4.  Add, edit, and delete tasks as needed.
5.  Use the checkbox to mark tasks as complete.
6.  Delete completed tasks individually or in bulk.
7.  Use the "Forget Password" functionality if needed.
8.  Navigate to the ISS location page to view the ISS's real-time location.

## Contributing

Contributions are welcome! If you have suggestions or want to add features, feel free to create a branch and submit a pull request.

## License

This project is licensed under the MIT License. Please do not remove the author's name from the license file.

## Author's Note

This is my first full-stack application, created as a practice project. While it may not be perfect, it represents a significant step in my learning journey. Thank you for using YouDo and have a good day!
