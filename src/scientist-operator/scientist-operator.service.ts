import { Inject, Injectable } from '@nestjs/common';
import { ScientistOperation } from './schemas/scientist-operation.schema';
import { ClientSession, Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateScientistOperationDto } from './dtos/scientist-operation.dto';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import Redis from 'ioredis';
import { Encryption } from 'src/encryption/encryption';
import { ConfigService } from '@nestjs/config';
const _ = require('lodash');

@Injectable()
export class ScientistOperatorService {
  constructor(@InjectModel(ScientistOperation.name) private scientistOperationModel: Model<ScientistOperation>, @Inject('SCIENTIST_OPERATOR_CLIENT') private readonly scientistOperatorClient: ClientProxy, @Inject('REDIS_CLIENT') private readonly redisConnector: Redis, private readonly encryption: Encryption, private readonly configService: ConfigService) {}

  async register(scientistOperationDto: CreateScientistOperationDto, clientSession: ClientSession): Promise<ScientistOperation> {
    await this.redisConnector.incr("scientist-operations-counter")
    const createdScientistOperation = new this.scientistOperationModel(scientistOperationDto);
    return await createdScientistOperation.save({ session: clientSession });
  }

  async publish(scientistOperation: ScientistOperation): Promise<string> {
    const message = scientistOperation;
    const record = new RmqRecordBuilder(message)
      .setOptions({
        headers: {
          ['x-version']: '1.0.0',
        },
        priority: 3,
      })
      .build();

    await this.scientistOperatorClient.send(this.configService.get<string>("rabbitmq.scientist-operations-to-solve-queue"), record)
    .subscribe({complete: console.info, error: console.error,  next: (v) => console.log(v)})

    return "publish-ok"
  }

  async findById(id: string): Promise<ScientistOperation> {
    return await this.scientistOperationModel.findById(id)
  }

  async search(filter: object, cursor: string, limit: number, sort: SortOrder, fieldOrder: string, fieldOrderType: string): Promise<{ cursor: string | undefined, results: ScientistOperation[] }> {
    let finalFilter: any = {
      ...filter
    }
    let cursorObject
    if (cursor) {
      cursorObject = JSON.parse(await this.encryption.decrypt(cursor))
      let filterForCursor = {}
      if (sort == 1 || sort == 'asc') {
        if (cursorObject.useSameFieldOrderValue) {
          filterForCursor[fieldOrder] = {
            $gte: cursorObject.fieldOrder
          }
        } else {
          filterForCursor[fieldOrder] = {
            $gt: cursorObject.fieldOrder
          }
        }
      } else {
        if (cursorObject.useSameFieldOrderValue) {
          filterForCursor[fieldOrder] = {
            $lte: cursorObject.fieldOrder
          }
        } else {
          filterForCursor[fieldOrder] = {
            $lt: cursorObject.fieldOrder
          }
        }
      }
      if (finalFilter[fieldOrder]) {
        let fieldOrderValue = finalFilter[fieldOrder]
        delete finalFilter[fieldOrder]
        if (!finalFilter.$and) {
          finalFilter.$and = []
        }
        let fieldOrderKeyValue = {}
        fieldOrderKeyValue[fieldOrder] = fieldOrderValue
        finalFilter.$and.push(fieldOrderKeyValue)
        let filterForCursorKeyValue = {}
        filterForCursorKeyValue[fieldOrder] = filterForCursor[fieldOrder]
        finalFilter.$and.push(filterForCursorKeyValue)

      } else {
        finalFilter = {
          ...finalFilter,
          ...filterForCursor
        }
      }
    }
    let nextCursor = undefined
    let results = await this.scientistOperationModel.find(finalFilter)
      .sort({ fieldOrder: sort })
      .limit(limit)
      .lean()


    results = _.map(results, (result) => {
      switch (fieldOrderType) {
        case "date":
          result[fieldOrder] = result[fieldOrder].toISOString()
          break;
      }
      return result
    })

    let groupsByFieldOrder = _.groupBy(results, fieldOrder)
    let lastGroupByFieldOrder = _.keys(groupsByFieldOrder).at(-1)

    if (lastGroupByFieldOrder) {
      let finalFilterGroup: any = {
        ...finalFilter,
      }
      finalFilterGroup[fieldOrder] = lastGroupByFieldOrder

      if (cursorObject) {
        let finalFilterGroupCursor = {
          $and: []
        }
        if(finalFilterGroup["_id"]){
          finalFilterGroupCursor.$and.push({_id: finalFilterGroup["_id"]})
          delete finalFilterGroup["_id"]
        }
        if (sort == 1 || sort == 'asc') {
          finalFilterGroupCursor.$and.push({_id: { $gt: cursorObject._id }})
        } else {
          finalFilterGroupCursor.$and.push({_id: { $lt: cursorObject._id }})
        }

        if (fieldOrder == '_id') {
          let fieldOrderValue = finalFilterGroup[fieldOrder]
          delete finalFilterGroup[fieldOrder]
          if (!finalFilterGroup.$and) {
            finalFilterGroup.$and = []
          }
          let fieldOrderKeyValue = {}
          fieldOrderKeyValue[fieldOrder] = fieldOrderValue
          finalFilterGroup.$and.push(fieldOrderKeyValue)
          let filterForCursorKeyValue = {}
          filterForCursorKeyValue[fieldOrder] = finalFilterGroupCursor[fieldOrder]
          finalFilterGroup.$and.push(filterForCursorKeyValue)
        } else {
          finalFilterGroup = {
            ...finalFilterGroup,
            ...finalFilterGroupCursor
          }
        }
      }
      let useSameFieldOrderValue = false
      if (fieldOrder != "_id") {
        let groupResults = await this.scientistOperationModel.find(finalFilterGroup)
          .sort({ _id: sort })
          .limit(limit)
        let lastGroupByFieldOrderCounter = groupsByFieldOrder[lastGroupByFieldOrder].length
        let removedResults = _.remove(results, (result) => { return result[fieldOrder] == lastGroupByFieldOrder })
        useSameFieldOrderValue = _.size(removedResults) > 0
        results = [...results, ..._.take(groupResults, lastGroupByFieldOrderCounter)]
      }

      if (results.length > 0) {
        nextCursor = (await this.encryption.encrypt(JSON.stringify({
          _id: results.at(-1)._id,
          fieldOrder: results.at(-1)[fieldOrder],
          useSameFieldOrderValue,
          sort
        })))
      }
    }

    return {
      results,
      cursor: nextCursor
    }
  }

  
}
