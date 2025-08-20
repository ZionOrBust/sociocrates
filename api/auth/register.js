import { db } from '../../server/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name, role = 'participant' } = req.body;
    
    // Registration logic here
    res.json({ success: true, message: 'User registered' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
}
