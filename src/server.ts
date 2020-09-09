import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Filter an image from a public url
  app.get("/filteredimage?:image_url", async (req, res) => {
    const imageUrl = req.query.image_url;

    if (!imageUrl) {
      return res.status(400).send({ message: "Image is required" });
    }

    try {
      const filteredImage = await filterImageFromURL(imageUrl);

      res.status(200).sendFile(filteredImage, () => {
        deleteLocalFiles([filteredImage]);
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
