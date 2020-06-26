const { v4: uuid} = require('uuid');
const mongoose = require('mongoose');

const Product = require('../models/product-model');
const HttpError = require('../models/http-error');

const getAllProduct= async (req, res, next) => {
  let product;

  try {
    product = await Product.find({});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find products.',
      500
    );
    return next(error);
  }
  res.json({ product: product.map(user => user.toObject({ getters: true })) });
}

const getProductById= async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product.',
      500
    );
    return next(error);
  }

    if (!product) {
    const error = new HttpError(
      'Could not find product for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) });
}


const deleteProduct = async (req, res, next) => {
  const deletedProduct = await Product.findById(req.params.pid);
  if (deletedProduct) {
    await deletedProduct.remove();
    res.send({ message: 'Deleted Product' });
  }
  else {
    res.send('Something went wrong, could not delete product');
  }
}

const updateProduct = async (req, res, next) => {
  const productId = req.params.pid;
  const product = await Product.findById(productId);
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    if (updatedProduct) {
      return res
        .status(200)
        .send({ message: 'Product Updated', data: updatedProduct });
    }
  }
  return res.status(500).send({ message: ' Something went wrong, could not update product' });
}

const createProduct= async(req,res,next) =>
{
  const createdProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      brand: req.body.brand,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
    });
    const newProduct = await createdProduct.save();
    if (newProduct) {
      return res
        .status(201)
        .send({ message: 'New Product Created', data: newProduct });
    }
    return res.status(500).send({ message: 'Something went wrong, could not create product' });

}

exports.getAllProduct = getAllProduct;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.deleteProduct = deleteProduct;
exports.updateProduct = updateProduct;
