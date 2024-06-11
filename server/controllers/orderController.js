import { Order } from '../models/orderModel.js';
import { Cart } from '../models/cartModel.js';
import { Product } from '../models/productModel.js';

class OrderController {
  async getOrder(req, res) {
    try {
      const { id } = req.params;
      console.log(req.user);
      const userRole = req.user.role[0];

      let order;

      if (userRole === 'ADMIN') {
        order = await Order.findById(id).populate('basket.items.product');
      } else {
        order = await Order.find({ userId: id }).populate('basket.items.product');
      }

      if (!order || (Array.isArray(order) && order.length === 0)) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async getOrderAdmin(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async postOrder(req, res) {
    try {
      const { userId, basket, data } = req.body;

      const basketItems = await Cart.findById(basket).populate('items.product');

      if (!basketItems) {
        return res.status(404).json({ message: 'Basket not found' });
      }

      const order = new Order({
        userId,
        basket: {
          items: basketItems.items,
          total: basketItems.total,
        },
        data,
        status: 'Pending',
      });

      const newOrder = await order.save();

      await Cart.findByIdAndDelete(basket);

      return res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await Order.find().populate('basket.items');

      if (!orders) {
        return res.status(404).json({ message: 'Orders not found' });
      }

      res.header('Content-Range', `items 0-${orders.length - 1}/${orders.length}`);

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async updateOrder(req, res) {
    try {
      const { id } = req.params;

      const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedOrder) {
        return res.status(404).json({ message: `Cannot find any order with ID: ${id}` });
      }

      return res.status(200).json(updatedOrder);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const deletedOrder = await Order.findByIdAndDelete(id);

      if (!deletedOrder)
        return res.status(404).json({ message: `Cannot find any product with ID: ${id}` });

      res.status(204).json(deletedOrder);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

export default new OrderController();
