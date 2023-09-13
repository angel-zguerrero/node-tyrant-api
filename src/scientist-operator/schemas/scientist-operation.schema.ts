import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";

export type ScientistOperationDocument = HydratedDocument<ScientistOperation>;
const expireTimeMs = 24 * 60 * 60 * 1000;
@Schema({ timestamps: true })
export class ScientistOperation {
  _id: string
  @Prop({ type: Object, required: true })
  operation: Object

  @Prop({ type: String, required: true, default: "pending", enum: ["pending", "success", "failed"] })
  status: string

  @Prop({ type: SchemaTypes.Mixed, required: false })
  failedReason: string

  @Prop({ type: Date, default: Date.now() + expireTimeMs })
  ttl: Date

  updatedAt: Date
  createdAt: Date
}

export const ScientistOperationSchema = SchemaFactory.createForClass(ScientistOperation);
ScientistOperationSchema.index({ttl: 1},{expireAfterSeconds: expireTimeMs / 1000});