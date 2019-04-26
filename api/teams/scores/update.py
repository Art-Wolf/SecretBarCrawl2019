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
keys = ['barId', 'score']

##
# Validate that the required variables were set
##
def validateReq(data, keys):
    for item in keys:
        if item not in data:
            logger.error("Couldn't create the score, no %s." % item)
            raise Exception("Couldn't create the score, no %s." % item)

##
# Create a score on the Team
##
def score(event, context):
    logger.info("Entering create score")
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

    # If there was no data to get, we get back an empty string
    if not result.get("Item"):
        logger.error("Team not found.")
        response = {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": "Team not found."
        }
    else:
        tempScore = {}
        found = False
        totalScore = 0

        for score in result['Item']['scores']:
            if score['barId'] == data['barId']:
                if score['bet'] is None:
                    logger.error("No bet placed for this bar")
                    response = {
                        "statusCode": 400,
                        "headers": {"Access-Control-Allow-Origin": "*"},
                        "body": "No bet placed for this bar."
                    }
                else:
                    tempScore = score

                    logger.info("Calculating new score")
                    if int(score['bet']) > int(data['score']):
                        tempScore['score'] = int(data['score'])/2
                    else:
                        tempScore['score'] = score['bet']

                    totalScore += int(tempScore['score'])
                    result['Item']['scores'].remove(score)

                    result['Item']['scores'].append(tempScore)
                    result['Item']['updatedAt'] = timestamp
                    found = True
            else:
                totalScore += int(score['score'])

        result['Item']['totalScore'] = totalScore
        logger.info("Adding Score to Team: {}".format(result['Item']))

        # write the data to the database
        table.update_item(
                Key={
                    'id': result['Item']['id']
                },
                ExpressionAttributeValues={
                  ':scores': result['Item']['scores'],
                  ':updatedAt': timestamp,
                },
                UpdateExpression='SET scores = :scores, updatedAt = :updatedAt ',
                ReturnValues='ALL_NEW',
            )

        # create a response
        if found:
            response = {
                "statusCode": 200,
                "headers": {"Access-Control-Allow-Origin": "*"}
                }

    logger.info("Returning Response: {}".format(response))
    return response
