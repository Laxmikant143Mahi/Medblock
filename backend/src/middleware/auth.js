const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.authenticateJWT = passport.authenticate('jwt', { session: false });

exports.authenticateGoogle = passport.authenticate('google', {
    scope: ['profile', 'email']
});

exports.generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Admin only.' });
};

exports.isNGO = (req, res, next) => {
    if (req.user && req.user.role === 'ngo') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. NGO only.' });
};

exports.checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};
