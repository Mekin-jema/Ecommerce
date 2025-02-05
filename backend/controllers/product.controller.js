import { Product } from "../models/product.model.js";
import { redis } from "../db/redis.js";
import cloudinary from "../db/cloudinary.js";
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    // if not in redis,fetch from mongodb
    // .lean() is gonna return a plain javascript oject instead of a  mongod document

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    //store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {}
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, img, category } = req.body;
    let cloudinaryResponse = null;

    if (img) {
      cloudinaryResponse = await cloudinary.uploader.upload(img, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.img) {
      const publicId = product.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("error deleting image from cloudinary ", error);
      } catch (error) {}
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "product deleted successfully" });
  } catch (error) {
    console.log("error in deleteProduct controller", error.message);
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log(
      "Error in getRecommendationProducts controller ",
      error.message
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.log("Error in getProductsCategory controller", error.message);
    res.status(500).json({ message: "server error ", error: error.message });
  }
};

export const toggleFeatureProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updateProduct = await product.save();
      await updateFeatureProductsCache();
      res.json(updateProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
  }
};
export const updateFeatureProductsCache = async () => {
  try {
    const featureProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("feature_products", JSON.stringify(featureProducts));
  } catch (error) {
    console.log("Error in update cache function");
  }
};
