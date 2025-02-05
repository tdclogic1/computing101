# computing101
# Online Detective Murder Mystery Game

A web-based multiplayer detective game where players collaborate or compete to solve murders through investigation, interrogation, and deduction.

## Architecture Overview

### Frontend (React)
- Single Page Application using React
- State management with Redux for game state
- WebSocket integration for real-time updates
- Responsive design for mobile/desktop play

### Backend (Node.js)
- Express.js server
- WebSocket server for real-time communication
- MongoDB for game state persistence
- Authentication system for players
- Redis for session management

## Core Modules

### GameEngine (game_engine.ts)
Frontend and backend coordinator:
```typescript
interface GameState {
  currentScene: string;
  inventory: Inventory;
  cluesDiscovered: Clue[];
  suspects: Suspect[];
  timeline: Timeline;
  players: Player[];
  gamePhase: GamePhase;
}
```

### Scene (scene.ts)
Interactive locations with WebGL rendering:
- 3D/2D scene visualization
- Interactive hotspots
- Real-time player positions
- Evidence markers
- Chat integration

### Character (character.ts)
NPC management system:
- AI-driven responses
- Dynamic behavior patterns
- Real-time interactions
- Multi-player dialogue handling
- Character state synchronization

### Evidence (evidence.ts)
Shared evidence system:
- Evidence synchronization across players
- Real-time evidence updates
- Collaborative analysis tools
- Evidence sharing mechanics
- Digital forensics system

### Inventory (inventory.ts)
Player inventory system:
- Cloud-synced storage
- Shared evidence repository
- Real-time updates
- Trading/sharing mechanics
- Evidence tagging system

### Timeline (timeline.ts)
Collaborative timeline system:
- Shared event tracking
- Real-time updates
- Multi-player editing
- Version control
- Conflict resolution

### DeductionSystem (deduction.ts)
Collaborative mystery solving:
- Shared theory building
- Real-time theory updates
- Voting system
- Progress tracking
- Team deduction tools

### DialogueSystem (dialogue.ts)
Multi-player dialogue management:
- Real-time chat
- Voice chat integration
- Dialogue history
- Team communication
- NPC interaction queuing

### CaseFile (case_file.ts)
Shared case management:
- Cloud-synced updates
- Collaborative editing
- Version history
- Access control
- Export functionality

## API Endpoints

### RESTful APIs
```typescript
// Player Management
POST /api/players/register
POST /api/players/login
GET /api/players/:id/profile

// Game Management
POST /api/games/create
GET /api/games/:id
PATCH /api/games/:id/state

// Evidence Management
POST /api/evidence/create
GET /api/evidence/:id
PATCH /api/evidence/:id

// Character Interactions
POST /api/characters/:id/interact
GET /api/characters/:id/dialogue
```

### WebSocket Events
```typescript
// Real-time Updates
socket.on('evidence:discovered', handleNewEvidence);
socket.on('character:moved', updateCharacterPosition);
socket.on('theory:proposed', handleNewTheory);
socket.on('chat:message', handleChatMessage);
```

## Database Schema

### MongoDB Collections
```typescript
interface Player {
  id: string;
  username: string;
  currentGame: string;
  inventory: string[];
  progress: GameProgress;
}

interface Game {
  id: string;
  players: string[];
  gameState: GameState;
  startTime: Date;
  lastUpdate: Date;
}

interface Evidence {
  id: string;
  type: EvidenceType;
  discoveredBy: string;
  sharedWith: string[];
  analysisResults: Analysis[];
}
```

## Getting Started

1. Clone and install dependencies:
```bash
git clone https://github.com/your-repo/detective-game
cd detective-game
npm install
```

2. Start development servers:
```bash
# Start backend
cd server
npm run dev

# Start frontend
cd client
npm run dev
```

3. Environment setup:
```env
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
WS_PORT=8080
```

## Deployment

1. Docker setup:
```dockerfile
# Frontend
FROM node:18 as client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# Backend
FROM node:18 as server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server .
COPY --from=client /app/client/dist /app/server/public
```

2. Kubernetes deployment:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: detective-game
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: game-server
        image: detective-game:latest
```

## Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## Security Considerations

1. Authentication:
   - JWT-based authentication
   - Rate limiting
   - CORS configuration
   - Input validation

2. Data Protection:
   - Encrypted WebSocket connections
   - Secure cookie handling
   - XSS prevention
   - CSRF protection

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Create pull request
5. Add tests for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.