module.exports = function (...allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.roleName || req.user.role?.name;
        if (allowedRoles.includes(userRole)) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden' });
    };
};
