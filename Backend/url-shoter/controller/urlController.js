import URL from "../model/url.js";
import { nanoid } from "nanoid";
import "dotenv/config";

export const handleGetUrl = async (req, res) => {
  try {
    const shortID = req.params.id;
    const result = await URL.findOne({ shortId: shortID });
    if (!result) {
      return res.status(404).json({ error: "URL not found!" });
    }

    // Ensure the redirect URL starts with a valid protocol
    const redirectUrl = result.redirectUrl.startsWith("http")
      ? result.redirectUrl
      : `http://${result.redirectUrl}`;

    console.log(`Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in handleGetUrl:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createShortUrl = async (req, res) => {
  try {
    const url = req.body.url;
    if (!url) res.status(400).send("url is required!");
    const id = nanoid(10);

    const result = await URL.create({
      shortId: id,
      redirectUrl: url,
    });

    res
      .status(201)
      .json({ shortURL: `${process.env.myURL}/${result.shortId}`, result });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
