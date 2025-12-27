import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
  try {
    // 1. कुकीज़ (Cookies) से टोकन निकालें
    const token = request.cookies.get("token")?.value || "";
    
    // अगर टोकन नहीं है, तो null भेजें
    if (!token) {
      return null;
    }

    // 2. टोकन को वेरीफाई करें
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    
    // 3. यूज़र की ID वापस भेजें
    return decodedToken.id;
    
  } catch (error) {
    // अगर टोकन एक्सपायर हो गया है या सिग्नेचर गलत है, तो null रिटर्न करें
    // इससे सर्वर क्रैश नहीं होगा, बस यूज़र को अनऑथोराइज्ड माना जाएगा
    return null;
  }
};