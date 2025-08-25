import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../../_lib/cors";
import { storage } from "../../_lib/storage";
import { generateToken } from "../../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name, role = 'participant' } = req.body;
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await storage.createUser({
      email,
      password,
      name,
      role,
      isActive: true
    });
    
    const token = generateToken(user.id);
    
    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
}
