import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface to describe the properties required in function build to create a new ticket
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties that a user document has
interface TicketDoc extends mongoose.Document<any> {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

// An interface that adds to tickets model a function named build
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttributes): TicketDoc;
}

// Create tickets schema
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// Assign build function
ticketSchema.statics.build = async (attrs: TicketAttributes) => {
  return new Ticket(attrs);
};

// tickets model constructor
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

// export tickets model
export { Ticket };
