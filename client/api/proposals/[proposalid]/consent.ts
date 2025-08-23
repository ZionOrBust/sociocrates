import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../../_lib/cors";
import { authenticateToken, requireAuth, type AuthenticatedRequest } from "../../_lib/auth";
import { storage } from "../../_lib/storage";

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

  const { proposalId } = req.query;

  if (req.method === 'GET') {
    try {
      const responses = await storage.getConsentResponses(proposalId as string);
      res.json(responses);
    } catch (error) {
      console.error('Error fetching consent responses:', error);
      res.status(500).json({ message: 'Failed to fetch consent responses' });
    }
  } else if (req.method === 'POST') {
    try {
      const { choice, reason } = req.body;
      const consentData = await storage.addConsentResponse({
        proposalId: proposalId as string,
        userId: authenticatedReq.user!.id,
        choice,
        reason
      });
      res.json(consentData);
    } catch (error) {
      console.error('Error adding consent response:', error);
      res.status(500).json({ message: 'Failed to add consent response' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
