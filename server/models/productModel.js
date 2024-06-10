import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      // required: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        return {
          id: ret._id,
          title: ret.title,
          features: ret.features,
          description: ret.description,
          price: ret.price,
          amount: ret.amount,
          images: ret.images,
          category: ret.category,
          isBestseller: ret.isBestseller,
        };
      },
    },
  },
);

export const Product = mongoose.model('Product', productSchema);
