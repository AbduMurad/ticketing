import { OrderStatus } from '@am-gittix/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttributes {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderDoc extends mongoose.Document<any> {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttributes): OrderDoc;
  findOrderPreviousVersion(
    id: string,
    version: number
  ): Promise<OrderDoc | null>;
}

const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = doc._id;
        delete ret._id;
      },
    },
  }
);

schema.set('versionKey', 'version');
schema.plugin(updateIfCurrentPlugin);

schema.statics.build = (attrs: OrderAttributes) => {
  const { id, ...rest } = attrs;
  return new Order({
    _id: attrs.id,
    ...rest,
  });
};

schema.statics.findOrderPreviousVersion = async (
  id: string,
  version: number
) => {
  return Order.findOne({
    _id: id,
    version: version - 1,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('order', schema);

export { Order };
