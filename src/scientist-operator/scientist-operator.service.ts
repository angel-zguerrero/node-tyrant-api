import { Inject, Injectable } from '@nestjs/common';
import { ScientistOperation } from './schemas/scientist-operation.schema';
import { ClientSession, Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateScientistOperationDto } from './dtos/scientist-operation.dto';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import Redis from 'ioredis';
import { createCipheriv, randomBytes, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';
const _ = require('lodash');

@Injectable()
export class ScientistOperatorService {
  iv: Buffer
  constructor(@InjectModel(ScientistOperation.name) private scientistOperationModel: Model<ScientistOperation>, @Inject('SCIENTIST_OPERATOR_CLIENT') private readonly scientistOperatorClient: ClientProxy, @Inject('REDIS_CLIENT') private readonly redisConnector: Redis) {
    this.iv = randomBytes(16);
  }

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
    await this.scientistOperatorClient.send('scientist-operations-to-solve', record)
      .subscribe()
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
      cursorObject = JSON.parse(await this.decrypt(cursor))
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
        let finalFilterGroupCursor = { }
        if (sort == 1 || sort == 'asc') {
          finalFilterGroupCursor['_id'] = {
            $gt: cursorObject._id
          }
        } else {
          finalFilterGroupCursor['_id'] = {
            $lt: cursorObject._id
          }
        }
        finalFilterGroup = {
          ...finalFilterGroup,
          ...finalFilterGroupCursor
        }
      }

      let groupResults = await this.scientistOperationModel.find(finalFilterGroup)
        .sort({ _id: sort })
        .limit(limit)
      let lastGroupByFieldOrderCounter = groupsByFieldOrder[lastGroupByFieldOrder].length
      let removedResults = _.remove(results, (result) => { return result[fieldOrder] == lastGroupByFieldOrder })
      let useSameFieldOrderValue = _.size(removedResults) > 0
      results = [...results, ..._.take(groupResults, lastGroupByFieldOrderCounter)]
      if (results.length > 0) {
        nextCursor = (await this.encrypt(JSON.stringify({
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

  async encrypt(text): Promise<string> {
    const password = '1234567';
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, this.iv);
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted
  }

  async decrypt(text): Promise<string> {
    const password = '1234567';
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, this.iv);
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec
  }
}
