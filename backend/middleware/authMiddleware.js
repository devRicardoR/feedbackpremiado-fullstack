const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Token ausente' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = {
            id: decoded.id,
            tipo: decoded.tipo,
        };
        next();
    } catch {
        return res.status(401).json({ erro: 'Token inválido' });
    }
};