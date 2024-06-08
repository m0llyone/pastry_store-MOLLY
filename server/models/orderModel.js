import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  _id: false,
  street: String,
  house: String,
  entrance: String,
  housing: String,
  flat: String,
  floor: String,
  streetPickUp: {
    type: String,
    required: function () {
      return this.delivery === 'selfCall';
    },
  },
});

const orderItemSchema = new mongoose.Schema({
  _id: false,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  options: {
    type: {
      kind: String,
      decor: String,
      weight: String,
    },
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    basket: {
      items: [orderItemSchema],
      total: { type: String, required: true },
    },
    data: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      delivery: {
        type: String,
        enum: ['selfCall', 'taxi'],
        default: 'selfCall',
      },
      address: {
        type: addressSchema,
        required: true,
      },
      payment: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash',
      },
      comment: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Cancelled'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        return {
          id: ret._id,
          userId: ret.userId,
          basket: ret.basket,
          data: ret.data,
          status: ret.status,
          createdAt: ret.createdAt,
        };
      },
    },
  },
);

export const Order = mongoose.model('Order', orderSchema);
