import mongoose, { Schema } from 'mongoose';

const suggestionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    wishes: {
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
          userId: ret.userId,
          name: ret.name,
          phone: ret.phone,
          wishes: ret.wishes,
        };
      },
    },
  },
);

export const Suggestion = mongoose.model('Suggestion', suggestionSchema);
