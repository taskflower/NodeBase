# TaskFlow Project

## Overview
TaskFlow is an AI-powered task management system that combines manual and autonomous task handling within organizations. It features intelligent task creation, automated processing, and configurable organizational workflows.

## Key Features
- Task Management (creation, assignment, processing)
- Autonomous Workflow Management
- Organization State Monitoring
- Configurable Process Definitions
- Role-based Task Assignment
- External Service Integration

## Technologies
- TypeScript/Node.js
- OpenAI API Integration
- File-based Storage

## Quick Start
1. Install dependencies: `npm install`
2. Set up environment: 
```bash
cp .env.example .env
# Add your OPENAI_API_KEY
```
3. Initialize data structure:
```json
# data/config/organization.json
{
  "processes": [
    {
      "id": "campaign_creation",
      "name": "Campaign Creation",
      "requiredPermissions": ["create_campaign"],
      "roles": ["Marketing Manager"]
    }
  ],
  "autonomy": {
    "maxTasksPerDay": 5,
    "requireApprovalFrom": ["CEO"]
  }
}

# data/employees/team.json
{
  "employees": [
    {
      "id": "ceo1",
      "name": "John Smith",
      "role": "CEO",
      "permissions": ["manage_all", "approve_tasks", "create_tasks"],
      "manages": ["director1", "director2"],
      "reports_to": null
    }
  ]
}
```
4. Run: `npm start`

## Architecture
- **Core System**: Task management, employee hierarchy
- **Autonomous Layer**: Process monitoring, automated task creation
- **Configuration**: Process definitions, autonomy limits
- **External Services**: API integrations for task processing

## Development
Build: `npm run build`
Test: `npm test`

## License
MIT