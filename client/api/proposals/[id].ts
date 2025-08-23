import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/cors";
import { authenticateToken, requireAuth, type AuthenticatedRequest } from "../_lib/auth";
import { storage } from "../_lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const authenticatedReq = req as AuthenticatedRequest;
  
  const isAuthenticated = await authenticateToken(authenticatedReq);
  if (!isAuthenticated) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const authCheck = requireAuth(authenticatedReq);
  if (!authCheck.isAuthenticated) {
    return res.status(401).json({ message: authCheck.error });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const proposal = await storage.getProposalById(id as string);
      if (!proposal) {
        return res.status(404).json({ message: 'Proposal not found' });
      }
      res.json(proposal);
    } catch (error) {
      console.error('Error fetching proposal:', error);
      res.status(500).json({ message: 'Failed to fetch proposal' });
    }
  } else if (req.method === 'PUT') {
    try {
      const proposal = await storage.updateProposal(id as string, req.body);
      if (!proposal) {
        return res.status(404).json({ message: 'Proposal not found' });
      }
      res.json(proposal);
    } catch (error) {
      console.error('Error updating proposal:', error);
      res.status(500).json({ message: 'Failed to update proposal' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
