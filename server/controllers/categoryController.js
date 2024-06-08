import { Category } from '../models/categoryModel.js';

class CategoryController {
  async getCategories(req, res) {
    try {
      const categories = await Category.find();
      if (!categories.length) {
        res.status(404).json({ message: `Categories are not found` });
      } else {
        res.status(201).json(categories);
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async postCategory(req, res) {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.query;
      const deleteCategory = await Category.findByIdAndDelete(id);
      if (!deleteCategory) return res.status(404).json({ message: `Сannot find any category` });
      return res.status(200).json(`The category has been deleted`);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
}

export default new CategoryController();
