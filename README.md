# TaskFlow Project

## Overview
TaskFlow is a task management system designed to streamline task creation, assignment, and execution within an organization. It utilizes a modular architecture and provides automated task generation and processing features, including hierarchical task splitting and reporting.

## Features
- **Task Management**: Create, assign, and manage tasks and subtasks.
- **Employee Management**: Display employee details and manage employee roles and hierarchies.
- **Automated Task Processing**: Utilize external services and mock APIs to process and analyze tasks.
- **Dynamic Reporting**: Generate reports on task progress and processing results.
- **Reset Functionality**: Reset the application by clearing tasks and conversations.

## Technologies Used
- **Node.js**: Backend runtime.
- **TypeScript**: For type-safe development.
- **fs-extra**: File system utilities.
- **dotenv**: Environment variable management.
- **inquirer**: Interactive command-line prompts.
- **ora**: Terminal spinner for task progress.
- **chalk**: Terminal string styling.
- **figlet**: ASCII art generator.

## Prerequisites
1. Node.js and npm installed on your system.
2. An OpenAI API key (optional for task analysis).

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/taskflow.git
   cd taskflow
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Initialize the data directories:
   ```bash
   mkdir -p data/employees data/tasks data/conversations
   ```
5. Add an employee team file in `data/employees/team.json` with the following structure:
   ```json
   {
     "employees": [
       {
         "id": "1",
         "name": "John Doe",
         "role": "Manager",
         "permissions": ["create_tasks"],
         "manages": ["2"],
         "reports_to": null
       },
       {
         "id": "2",
         "name": "Jane Smith",
         "role": "Developer",
         "permissions": ["complete_tasks"],
         "manages": [],
         "reports_to": "1"
       }
     ]
   }
   ```

## Running the Application
1. Start the application:
   ```bash
   npm start
   ```
2. Follow the on-screen menu to:
   - Create tasks.
   - Process tasks.
   - View tasks.
   - List employees.
   - Reset the application.

## Project Structure
- **src/**: Contains all source code.
  - **company.ts**: Handles core company operations like employee and task management.
  - **employee.ts**: Defines the Employee class for task processing.
  - **index.ts**: Entry point for the application.
  - **mockServices.ts**: Mock external services for task processing.
  - **modelConnector.ts**: Connects tasks to external or mock APIs.
  - **taskManager.ts**: Manages task creation and updates.
  - **types/**: Type definitions for tasks, employees, and services.
  - **output/**: Helper utilities for logging and reporting.
- **data/**: Contains task, employee, and conversation data.

## Development
### Building the Project
Run the following command to transpile the TypeScript code:
```bash
npm run build
```

### Running Tests
Add tests in the `tests/` directory and run them using your preferred test framework.

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests.

### Contribution Steps
1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request with detailed changes.

## License
This project is licensed under the MIT License.

## Acknowledgments
Special thanks to OpenAI for their powerful API and the Node.js community for their robust libraries.

