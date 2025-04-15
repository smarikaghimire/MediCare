// pages/api/debug.js
export default async function handler(req, res) {
  try {
    // Return environment info (without sensitive values)
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriFormat: process.env.MONGODB_URI
        ? `${process.env.MONGODB_URI.split("@")[0].split(":")[0]}:***@${
            process.env.MONGODB_URI.split("@")[1]
          }`
        : "Not configured",
    };

    // Return information about the request
    const requestInfo = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
    };

    res.status(200).json({
      success: true,
      message: "API is reachable",
      environment: envInfo,
      request: requestInfo,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "API debug route error",
      error: error.message,
    });
  }
}
