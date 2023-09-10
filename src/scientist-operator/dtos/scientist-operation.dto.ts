export class CreateScientistOperationDto {
  _id: string
  operation: Object
}

export class CreateScientistOperationNotification {
  operation_ids: string[]
  code: string
}