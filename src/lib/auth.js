import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function authenticate(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new Error('Token is missing');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;  // Returns the decoded JWT payload
  } catch (error) {
    throw new Error('Invalid token');
  }
}
