import json
import logging
import os
import time
import uuid
import random

import boto3
dynamodb = boto3.resource('dynamodb')

keys = ['name']

def validateReq(data, keys):
    for item in keys:
        if item not in data:
            logging.error("Validation Failed")
            raise Exception("Couldn't create the team, no %s." % item)
            return


def createTeam(event, context):
    data = json.loads(event['body'])
    validateReq(data, keys)


    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

    item = {
        'id': str(random.randint(1, 100)),
        'name': data['name']
    }

    # write the todo to the database
    table.put_item(Item=item)

    # create a response
    response = {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"}, 
        "body": json.dumps(item)
    }

    return response
