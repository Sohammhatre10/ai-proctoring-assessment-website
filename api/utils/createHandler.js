export const createHandler = (handlers) => {
  return async (req, res) => {
    try {
      const handler = handlers[req.method];

      if (!handler) {
        return res.status(405).json({
          error: `Method ${req.method} Not Allowed`,
        });
      }

      await handler(req, res);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  };
};
