import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";

export type ScientistOperationDocument = HydratedDocument<ScientistOperation>;
const expireTimeMs = 24 * 60 * 60 * 1000;
@Schema({ timestamps: true })
export class ScientistOperation {
  @Prop({ type: Object, required: true })
  operation: Object

  @Prop({ type: String, required: true, default: "pending", enum: ["pending", "success", "failed"] })
  status: string

  @Prop({ type: SchemaTypes.Mixed, required: false })
  failedReason: string

  @Prop({ type: Date, default: Date.now() + expireTimeMs })
  ttl: Date
}

export const ScientistOperationSchema = SchemaFactory.createForClass(ScientistOperation);
ScientistOperationSchema.index({ttl: 1},{expireAfterSeconds: expireTimeMs / 1000});