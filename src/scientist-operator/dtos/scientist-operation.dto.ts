export class CreateScientistOperationDto {
  _id: string
  operation: Object
  status: String
  ttl: Date
  createdAt: Date
  updatedAt: Date
  failedReason: String
}

export class CreateScientistOperationNotification {
  operation_ids: string[]
  code: string
}