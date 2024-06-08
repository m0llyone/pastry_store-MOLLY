import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    options: {
      kind: {
        type: [String],
        required: true,
      },
      decor: {
        type: [String],
        required: true,
      },
      weight: {
        type: [String],
        required: true,
      },
    },
    baseWeight: {
      type: String,
      required: true,
    },
    conditions: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        return {
          id: ret._id,
          category: ret.category,
          title: ret.title,
          options: ret.options,
          baseWeight: ret.baseWeight,
          conditions: ret.conditions,
        };
      },
    },
  },
);

export const Category = mongoose.model('Category', categorySchema);
