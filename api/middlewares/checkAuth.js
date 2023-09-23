const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    try {
        if (!token) {
            return res.status(403).send({
                message: "Unauthorized"
            });
        }

        token = token.split(' ')[1];
    
        jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized: Token expired"
                });
            }
            req.cookie = decoded.cookie;
            next();
        });
        
    } catch (error) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
};

const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;