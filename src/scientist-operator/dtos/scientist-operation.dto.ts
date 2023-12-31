export class CreateScientistOperationDto {
  _id: string
  operation: Object
  resultData: Object
  status: String
  ttl: Date
  createdAt: Date
  updatedAt: Date
  failedReason: String
  progress: Number
}

export class CreateScientistOperationNotification {
  operation_ids: string[]
  code: string
}