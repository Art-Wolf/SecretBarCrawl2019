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
# Delete the Member
##
def member(event, context):
    logger.info("Entering delete member")
    logger.info("Received Event: {}".format(event))

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DYNAMODB_TEAM_TABLE'])

    # Make sure we got an ID from the path
    if ('pathParameters' not in event) or ('id' not in event['pathParameters']) or ('memberId' not in event['pathParameters']):
        logger.error("No team/member id supplied in event.")
        raise Exception("No team/member id supplied in event.")

    result = table.get_item(
        Key={
            'id': event['pathParameters']['id']
        }
    )

    timestamp = int(time.time() * 1000)

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
            logger.error("No Members on Team to Delete")
            response = {
                "statusCode": 400,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": "No Members on Team to Delete"
            }

        found = False
        for member in result['Item']['members']:
            if member['id'] == event['pathParameters']['memberId']:
                logger.info("Found Member to Delete: {}".format(member));
                result['Item']['members'].remove(member)
                found = True

        if found:
            # write the data to the database
            newItem = table.put_item(Item=result['Item'])

            # create a response
            response = {
                "statusCode": 200,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps(newItem, cls=DecimalEncoder)
            }
        else:
            logger.error("No Members on Team to Delete")
            response = {
                "statusCode": 400,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": "Member not found on Team"
            }

    logger.info("Returning Response: {}".format(response));
    return response
