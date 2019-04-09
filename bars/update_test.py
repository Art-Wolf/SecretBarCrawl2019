from update import bar

import unittest
import datetime
import time
import json
import os
import boto3
from moto import mock_dynamodb2

##
# Test the Update methods
##
class TestUpdate(unittest.TestCase):

    ##
    # Tests update bar with no Event
    ##
    def test_update_bar_empty(self):
        try:
            bar(None, None)
        except Exception as e:
            self.assertEquals("No body supplied in event", e.message)

    ##
    # Tests update bar with no id
    ##
    def test_update_bar_no_id(self):
        event = {}
        event['body'] = '{"name": "Test"}'

        try:
            bar(event, None)
        except Exception as e:
            self.assertEquals("No bar id supplied in event.", e.message)

    ##
    # Tests update bar no matching item
    ##
    @mock_dynamodb2
    def test_update_bar_no_item(self):

        # Mock out DynamoDB
        dynamo = boto3.client('dynamodb', region_name='us-west-2')
        dynamo.create_table(
            TableName='serverless-rest-api-with-dynamodb-bars-dev',
            KeySchema=[{
                'AttributeName': 'id',
                'KeyType': 'HASH'
            }],
            AttributeDefinitions=[{
                'AttributeName': 'id',
                'AttributeType': 'S'
            }],
            ProvisionedThroughput={
                'ReadCapacityUnits': 1,
                'WriteCapacityUnits': 1
            })

        # Mock out the Test Event and Path ID
        event = {}
        event['body'] = '{"name": "Test", "address": "245 Summer St, Boston, MA 02125"}'
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'

        # Set the table environment name
        os.environ['DYNAMODB_BAR_TABLE'] = 'serverless-rest-api-with-dynamodb-bars-dev'

        # Test
        res = bar(event, None)
        self.assertEquals(400, res['statusCode'])

    ##
    # Test a successful bar update
    ##
    @mock_dynamodb2
    def test_update_bar(self):

        # Mock out DynamoDB
        dynamo = boto3.client('dynamodb', region_name='us-west-2')
        dynamo.create_table(
            TableName='serverless-rest-api-with-dynamodb-bars-dev',
            KeySchema=[{
                'AttributeName': 'id',
                'KeyType': 'HASH'
            }],
            AttributeDefinitions=[{
                'AttributeName': 'id',
                'AttributeType': 'S'
            }],
            ProvisionedThroughput={
                'ReadCapacityUnits': 1,
                'WriteCapacityUnits': 1
            })

        # Setup Test Data - this needs to be in DynamoDB JSON format
        initialData = {}
        initialData['id'] = { 'S': '123' }
        initialData['name'] = { 'S': 'old' }

        dynamo.put_item(
            TableName='serverless-rest-api-with-dynamodb-bars-dev',
            Item=initialData)

        # Mock out the Test Event and Path ID
        event = {}
        event['body'] = '{"name": "Test", "address": "245 Summer St, Boston, MA 02125"}'
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'

        # Set the table environment name
        os.environ['DYNAMODB_BAR_TABLE'] = 'serverless-rest-api-with-dynamodb-bars-dev'

        # Test
        res = bar(event, None)
        self.assertEquals(200, res['statusCode'])

if __name__ == '__main__':
    unittest.main()
