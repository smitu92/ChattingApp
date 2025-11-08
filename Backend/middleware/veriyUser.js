// import { jwt } from "jsonwebtoken";

// const verifyUser=(req,res,next)=>{
//         const {Authorization}=req.headers;
//         console.log(Authorization);
//         console.log(req);

//         if (Authorization) {
//             const trim=Authorization.trim("_");
//             console.log(trim);
//             JsonWebTokenError
//            const isvalidUser=jwt.verify(trim[1],JWT_ACCESS_SECRET);
//            if (!isvalidUser) {
//                res.status(501).json({message:"user is not valid"})
//                throw new Error("user is not valid ,please do authentication")
//            }
//            next();
//            return;
//         }
//         else{
//             res.status(501).json({message:"user does not have any authorization code"});
//             throw new Error("user does not have any authorization code");
//         }
        
// }
// middleware/verifyUser.js
import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: "Authorization header missing. Please login." 
      });
    }

    // Expected format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Token missing. Please provide a valid token." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
   
    // Attach user info to request object
    req.user = decoded;
    req.userId = decoded.userId || decoded._id || decoded.id;
    
    console.log('✅ User authenticated:', req.userId);
    
    // Continue to next middleware/route
    next();
    
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token. Please login again." 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token expired. Please login again." 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: "Authentication failed." 
    });
  }
};

export default verifyUser;
