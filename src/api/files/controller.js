import Files from "../../models/files";
import logger from "../../utils/logger";

export default {
  async index(req, res) {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;

    if (limit > 50) {
      return res.status(400).send({ error: "Limit cannot be greater than 50" });
    }

    try {
      const totalFiles = await Files.countDocuments();
      if (totalFiles === 0) {
        res.send({
          result: {
            files: [],
            totalFiles: 0,
            totalPages: 0,
            currentPage: page,
          },
        });
        return;
      }
      const totalPages = Math.ceil(totalFiles / limit);

      if (page > totalPages) {
        return res.status(404).send({ error: "Page not found" });
      }

      const skip = (page - 1) * limit;

      const files = await Files.find()
        .skip(skip)
        .limit(limit)
        .select({ cid: 1, filename: 1, timestamp: 1, _id: 0 })
        .sort({ timestamp: -1 });

      res.send({
        result: {
          files,
          totalFiles,
          totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      logger.error(error.toString());
      res.send({
        error: "Error",
      });
    }
  },
};
