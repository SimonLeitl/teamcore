# teamcore

TeamCore is a modular platform that connects playtime data with bonus and travel expense management for sports teams

## 🚀 Features

- **TypeScript Serverless Functions**: Built with TypeScript for type safety and better developer experience
- **Vercel Deployment**: Ready to deploy serverless functions on Vercel's edge network
- **Modular Architecture**: Easy to extend with additional API endpoints

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- Vercel CLI (optional, for local development)

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Local Development

To run the serverless functions locally using Vercel CLI:

```bash
npm run dev
```

This will start a local development server at `http://localhost:3000`.

### 3. Type Checking

To check TypeScript types without building:

```bash
npm run type-check
```

Or to continuously watch for changes:

```bash
npm run build
```

## 📁 Project Structure

```
teamcore/
├── api/                      # Serverless functions directory
│   ├── hello.ts             # Sample TypeScript serverless function
│   └── tsconfig.json        # TypeScript configuration for API functions
├── .gitignore               # Git ignore rules
├── .vercelignore            # Vercel deployment ignore rules
├── package.json             # Project dependencies and scripts
├── vercel.json              # Vercel deployment configuration
└── README.md                # This file
```

## 🧪 Testing the Sample Function

### Locally

After running `npm run dev`, visit:

```
http://localhost:3000/api/hello
http://localhost:3000/api/hello?name=YourName
```

### After Deployment

Once deployed to Vercel, the function will be available at:

```
https://your-project.vercel.app/api/hello
https://your-project.vercel.app/api/hello?name=YourName
```

## 📝 Creating New Functions

To add a new serverless function:

1. Create a new `.ts` file in the `/api` directory
2. Export a default async function with the Vercel handler signature:

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Your function logic here
  res.status(200).json({ message: 'Success' });
}
```

3. The function will automatically be available at `/api/[filename]`

## 🚢 Deployment

### Deploy to Vercel

1. Install Vercel CLI (if not already installed):

```bash
npm install -g vercel
```

2. Deploy to Vercel:

```bash
vercel
```

3. Follow the prompts to link your project and deploy

### Automatic Deployment

Connect your GitHub repository to Vercel for automatic deployments:

1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect the configuration and deploy
4. Every push to the main branch will trigger a new deployment

## 🔧 Configuration

### TypeScript Configuration

TypeScript is configured in `/api/tsconfig.json` with strict mode enabled for type safety. Adjust the configuration as needed for your project requirements.

### Vercel Configuration

The `vercel.json` file configures how Vercel builds and deploys your functions. The current setup specifies:

- TypeScript functions in the `/api` directory
- Node.js runtime version

## 📚 API Documentation

### `GET /api/hello`

Sample hello world endpoint.

**Query Parameters:**
- `name` (optional): Name to greet (default: "World")

**Response:**
```json
{
  "message": "Hello, World!",
  "timestamp": "2025-12-26T21:00:00.000Z",
  "method": "GET"
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC
