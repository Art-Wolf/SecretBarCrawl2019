import json
import logging
import os
import decimal
import boto3

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
# Get an individual team from the dynamodb Table
##
def team(event, context):
    logger.info("Entering get team")
    logger.info("Received Event: {}".format(event))

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

    # If there was no data to get, we get back an empty string
    if not result.get("Item"):
        logger.error("No Team to Get")
        response = {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": "No Team to Get"
        }
    else:
        response = {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps(result['Item'], cls=DecimalEncoder)
        }

    logger.info("Returning Response: {}".format(response));

    return response
