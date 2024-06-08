import mongoose from 'mongoose';

const optionsSchema = new mongoose.Schema({
  _id: false,
  kind: {
    type: String,
    required: true,
  },
  decor: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        options: { type: optionsSchema, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    total: {
      type: Number,
      required: true,
      default: 0,
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
          items: ret.items,
          total: ret.total,
          status: ret.status,
          createdAt: ret.createdAt,
        };
      },
    },
  },
);

export const Cart = mongoose.model('Cart', cartSchema);
