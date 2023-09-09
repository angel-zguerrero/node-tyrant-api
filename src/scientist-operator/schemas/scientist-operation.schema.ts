import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ScientistOperationDocument = HydratedDocument<ScientistOperation>;
const expireTimeMs = 24 * 60 * 60 * 1000;
@Schema({ timestamps: true })
export class ScientistOperation {
  @Prop({ type: Object, required: true })
  operation: Object

  @Prop({ type: Date, default: Date.now() + expireTimeMs })
  ttl: Date
}

export const ScientistOperationSchema = SchemaFactory.createForClass(ScientistOperation);
ScientistOperationSchema.index({ttl: 1},{expireAfterSeconds: expireTimeMs / 1000});