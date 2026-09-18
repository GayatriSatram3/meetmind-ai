const {
  pipeline,
} = require("@xenova/transformers");

let extractor = null;

const generateEmbedding = async (text) => {
  try {
    if (!extractor) {
      console.log(
        "Loading local embedding model..."
      );

      extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );

      console.log(
        "Embedding model loaded successfully."
      );
    }

    const output = await extractor(
      text,
      {
        pooling: "mean",
        normalize: true,
      }
    );

    return Array.from(output.data);

  } catch (error) {
    console.error(
      "Local embedding error:",
      error
    );

    throw new Error(
      "Failed to generate embedding"
    );
  }
};

module.exports = {
  generateEmbedding,
};