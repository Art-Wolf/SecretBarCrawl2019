import json
import logging
import os
import time
import uuid
import random

import boto3
dynamodb = boto3.resource('dynamodb')

def teams (event, context):
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

    result = table.scan()

    response = {
        "statusCode": 200,
        "body": json.dumps(result['Items'])
    }

    return response