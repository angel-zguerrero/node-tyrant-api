import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ScientistOperationDocument = HydratedDocument<ScientistOperation>;

@Schema()
export class ScientistOperation {
  @Prop({ type: Object, required: true })
  operation: Object
}

export const ScientistOperationSchema = SchemaFactory.createForClass(ScientistOperation);