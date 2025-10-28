// Next.js API Routes - 헬스 체크
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Link IT Backend API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      mode: 'nextjs-api-routes',
      vercel: process.env.VERCEL === '1'
    })
  } catch (error) {
    res.status(500).json({
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    })
  }
}
