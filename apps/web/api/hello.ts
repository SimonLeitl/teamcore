import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Sample serverless function handler for Vercel
 * 
 * This function demonstrates the basic structure of a TypeScript
 * serverless function for Vercel deployment.
 * 
 * @param req - Vercel request object
 * @param res - Vercel response object
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const { name = 'World' } = req.query;

  try {
    res.status(200).json({
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
      method: req.method,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
