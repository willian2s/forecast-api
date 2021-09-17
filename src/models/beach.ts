import mongoose, { Document, Model, Schema } from 'mongoose';

export enum GeoPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  _id?: string;
  name: string;
  position: GeoPosition;
  lat: number;
  lng: number;
  user: string;
}

const { ObjectId } = Schema.Types;

const schema = new mongoose.Schema(
  {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
    name: { type: String, require: true },
    position: { type: String, require: true },
    user: { type: ObjectId, ref: 'User', required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface BeachModel extends Omit<Beach, '_id'>, Document {}
export const Beach: Model<BeachModel> = mongoose.model('Beach', schema);
