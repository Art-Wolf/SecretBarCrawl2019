import json
import time
import logging
import os

import boto3
dynamodb = boto3.resource('dynamodb')


def updateTeam(event, context):
    data = json.loads(event['body'])
    if 'members' not in data:
        logging.error("Validation Failed")
        raise Exception("Couldn't update the team members.")
        return

    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

    # update the todo in the database
    result = table.update_item(
        Key={
            'id': event['pathParameters']['id']
        },
        ExpressionAttributeValues={
          ':members': data['members'],
        },
        UpdateExpression='SET members = :members ',
        ReturnValues='ALL_NEW',
    )

    # create a response
    response = {
        "statusCode": 200,
        "body": json.dumps(result['Attributes'])
    }

    return response
