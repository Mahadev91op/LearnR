import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
  try {
    // 1. कुकीज़ (Cookies) से टोकन निकालें
    const token = request.cookies.get("token")?.value || "";
    
    // अगर टोकन नहीं मिला, तो एरर दिखाओ
    if (!token) {
      throw new Error("Token not found");
    }

    // 2. टोकन को वेरीफाई करें (TOKEN_SECRET का यूज़ करके)
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    
    // 3. यूज़र की ID वापस भेजें
    return decodedToken.id;
    
  } catch (error) {
    throw new Error(error.message);
  }
};