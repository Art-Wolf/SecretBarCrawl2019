from create import bar

import unittest
import datetime
import time
import json
import os
import boto3
from moto import mock_dynamodb2

dynamodb = boto3.resource('dynamodb')

##
# Test the Create methods
##
class TestCreate(unittest.TestCase):

    ##
    # Tests create bar with no Event
    ##
    def test_create_bar_empty(self):
        try:
            bar(None, None)
        except Exception as e:
            self.assertEquals("No body supplied in event", e.message)

    ##
    # Tests create bar with only the name set
    ##
    def test_create_bar_name_only(self):
        event = {}
        event['body'] = '{"name": "Test"}'

        try:
            bar(event, None)
        except Exception as e:
            self.assertEquals("Couldn't create the bar, no address.", e.message)

    ##
    # Tests create bar with only the address set
    ##
    def test_create_bar_address_only(self):
        event = {}
        event['body'] = '{"address": "245 Summer St, Boston, MA 02125"}'

        try:
            bar(event, None)
        except Exception as e:
            self.assertEquals("Couldn't create the bar, no name.", e.message)

    ##
    # Tests a successful create bar
    ##
    @mock_dynamodb2
    def test_create_bar(self):

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

        # Mock out the Test Event
        event = {}
        event['body'] = '{"name": "Test", "address": "245 Summer St, Boston, MA 02125"}'

        # Set the table environment name
        os.environ['DYNAMODB_BAR_TABLE'] = 'serverless-rest-api-with-dynamodb-bars-dev'

        # Test
        res = bar(event, None)
        self.assertEquals(200, res['statusCode'])

if __name__ == '__main__':
    unittest.main()
