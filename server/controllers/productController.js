import { Category } from '../models/categoryModel.js';
import { Product } from '../models/productModel.js';

class ProductController {
  // async getProductsAdmin(req, res, next) {
  //   try {
  //   const products = await Product.find();
  //   res.header('Content-Range', `items 0-${products.length - 1}/${products.length}`);
  //   if (!products.length) {
  //     res.status(404).json({ message: `Cannot find any users` });
  //   } else {
  //     res.status(201).json(products);
  //   }
  // } catch (e) {
  //   res.status(500).json({ message: e.message });
  // }
  // }

  async getProducts(req, res) {
    try {
      const ITEMS_PER_PAGE = 6;
      const { page, category, title, all } = req.query;
      const query = {};
      const role = req.user.role[0];

      if (role === 'ADMIN') {
        const products = await Product.find();
        res.header('Content-Range', `items 0-${products.length - 1}/${products.length}`);
        if (!products.length) {
          res.status(404).json({ message: `Cannot find any users` });
        } else {
          res.status(201).json(products);
        }
      } else if (role === 'USER') {
        if (category) {
          const categoryDoc = await Category.findOne({ category });
          if (!categoryDoc) {
            return res.status(404).json({ message: 'Категория не найдена' });
          }
          query.category = categoryDoc._id;
        }

        if (title) {
          query.title = { $regex: title, $options: 'i' };
        }

        let products, count;

        if (all) {
          products = await Product.find(query).populate('category');
          if (products.length === 0) {
            return res.status(404).json({ message: 'Продукты не найдены' });
          }

          res.header('Content-Range', `items 0-${products.length - 1}/${products.length}`);

          return res.json({ products });
        } else {
          const skip = (page - 1) * ITEMS_PER_PAGE;
          [count, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query).limit(ITEMS_PER_PAGE).skip(skip).populate('category'),
          ]);

          const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

          if (products.length === 0) {
            return res.status(404).json({ message: 'Продукты не найдены' });
          }

          return res.json({
            pagination: {
              count,
              pageCount,
              currentPage: page,
            },
            products,
          });
        }
      }
    } catch (e) {
      res.status(500).json({ message: 'Ошибка сервера', error: e.message });
    }
  }

  async getProduct(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'Id not specified' });
      }

      const product = await Product.findById(id).populate('category');

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(product);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async getSimilarProducts(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findById(id).populate('category');
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const similarProducts = await Product.aggregate([
        { $match: { category: product.category._id, _id: { $ne: product._id } } },
        { $sample: { size: 3 } },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: '$category' },
      ]);

      res.status(200).json(similarProducts);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async postProduct(req, res) {
    try {
      const product = await Product.create(req.body);
      res.status(200).json(product);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedProduct)
        return res.status(404).json({ message: `Cannot find any product with ID: ${id}` });
      res.header('Content-Range', 'items 0-9/100');
      res.status(200).json(updatedProduct);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct)
        return res.status(404).json({ message: `Cannot find any product with ID: ${id}` });

      res.status(204).json(deletedProduct);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}
export default new ProductController();
