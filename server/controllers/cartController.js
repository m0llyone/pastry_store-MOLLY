import { Cart } from '../models/cartModel.js';
import { Product } from '../models/productModel.js';

class BasketController {
  async getBasket(req, res) {
    try {
      const { id } = req.params;

      const basket = await Cart.findOne({ userId: id }).populate('items.product');

      if (!basket) {
        return res.status(404).json({ message: 'Your basket is empty' });
      }

      return res.status(200).json(basket);
    } catch (error) {
      console.error('Error fetching basket:', error); // Добавлено логирование
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async setBasket(req, res) {
    try {
      const { userId, items } = req.body;

      if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid data provided' });
      }

      let cart = await Cart.findOne({ userId });

      if (cart) {
        items.forEach((item) => {
          const existingItem = cart.items.find(
            (cartItem) =>
              cartItem.product.toString() === item.product &&
              JSON.stringify(cartItem.options) === JSON.stringify(item.options),
          );

          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            cart.items.push(item);
          }
        });
      } else {
        cart = new Cart({
          userId,
          items,
        });
      }

      const productPromises = cart.items.map(async (item) => {
        const product = await Product.findById(item.product);
        return product.price * item.quantity;
      });

      const productPrices = await Promise.all(productPromises);
      cart.total = productPrices.reduce((acc, price) => acc + price, 0);

      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.product');
      return res.status(200).json(populatedCart);
    } catch (error) {
      console.error('Error setting basket:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async deleteBasket(req, res) {
    try {
      const { id } = req.params;
      await Cart.findOneAndDelete({ userId: id });
      res.status(200).json({ message: 'Basket deleted successfully' });
    } catch (error) {
      console.error('Error deleting basket:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id, product } = req.query;
      const basket = await Cart.findById(id);

      if (!basket) {
        return res.status(404).json({ message: 'Basket not found' });
      }

      const index = basket.items.findIndex((item) => item._id.toString() === product);
      if (index === -1) {
        return res.status(404).json({ message: 'Product not found in basket' });
      }

      basket.items.splice(index, 1);

      const productPromises = basket.items.map(async (item) => {
        const product = await Product.findById(item.product);
        return product.price * item.quantity;
      });

      const productPrices = await Promise.all(productPromises);
      basket.total = productPrices.reduce((acc, price) => acc + price, 0);

      await basket.save();

      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product from basket:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default new BasketController();
