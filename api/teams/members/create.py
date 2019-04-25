import json
import logging
import os
import time
import uuid
import random
import boto3
import decimal

##
# Helper class to convert a DynamoDB item to JSON.
##
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

##
# Configure the logger
##
root = logging.getLogger()
if root.handlers:
    for handler in root.handlers:
        root.removeHandler(handler)
logging.basicConfig(format='%(asctime)s %(message)s',level=logging.INFO)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

##
# Required variables
##
keys = ['name']

##
# Validate that the required variables were set
##
def validateReq(data, keys):
    for item in keys:
        if item not in data:
            logger.error("Couldn't create the member, no %s." % item)
            raise Exception("Couldn't create the member, no %s." % item)

##
# Create a Member on the Team
##
def member(event, context):
    logger.info("Entering create member")
    logger.info("Received Event: {}".format(event))

    # Make sure we got data to update with
    if (event is None) or (event['body'] is None):
        logger.error("No body supplied in event")
        raise Exception("No body supplied in event")

    data = json.loads(event['body'])
    validateReq(data, keys)

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DYNAMODB_TEAM_TABLE'])

    # Make sure we got an ID from the path
    if ('pathParameters' not in event) or ('id' not in event['pathParameters']):
        logger.error("No team id supplied in event.")
        raise Exception("No team id supplied in event.")

    result = table.get_item(
        Key={
            'id': event['pathParameters']['id']
        }
    )

    timestamp = int(time.time() * 1000)

    # The new member
    newMember = {
        'id': str(uuid.uuid1()),
        'name': data['name'],
        'createdAt': timestamp
    }

    # If there was no data to get, we get back an empty string
    if not result.get("Item"):
        logger.error("No Team to Get")
        response = {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": "No Team to Get"
        }
    else:
        # Check if there are any existing members
        if 'members' not in result['Item']:
            logger.info("First member on team");
            result['Item']['members'] = []

        result['Item']['members'].append(newMember)
        result['Item']['updatedAt'] = timestamp

        logger.info("Adding Member to Team: {}".format(result['Item']));

        # write the data to the database
        newItem = table.put_item(Item=result['Item'])

        # create a response
        response = {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps(newItem, cls=DecimalEncoder)
            }

    logger.info("Returning Response: {}".format(response));
    return response
