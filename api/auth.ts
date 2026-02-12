
export default async function handler(req: any, res: any) {
  const { method } = req;

  if (method === 'POST') {
    const { password } = req.body;
    if (password === 'admin123') {
      res.status(200).json({ token: 'secure_session_token_' + Date.now() });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(400).json({ success: false });
  }
}
