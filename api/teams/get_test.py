from get import team

import unittest
import datetime
import time
import json
import os
import boto3
from moto import mock_dynamodb2

##
# Test the Get methods
##
class TestGet(unittest.TestCase):

    ##
    # Tests get team with no id
    ##
    def test_get_team_no_id(self):
        event = {}
        event['body'] = '{"name": "Test"}'

        try:
            team(event, None)
        except Exception as e:
            self.assertEquals("No team id supplied in event.", e.message)

    ##
    # Tests get team no matching item
    ##
    @mock_dynamodb2
    def test_get_team_no_item(self):

        # Mock out DynamoDB
        dynamo = boto3.client('dynamodb', region_name='us-west-2')
        dynamo.create_table(
            TableName='serverless-rest-api-with-dynamodb-teams-dev',
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
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = team(event, None)
        self.assertEquals(400, res['statusCode'])

    ##
    # Test a successful team get
    ##
    @mock_dynamodb2
    def test_get_team(self):

        # Mock out DynamoDB
        dynamo = boto3.client('dynamodb', region_name='us-west-2')
        dynamo.create_table(
            TableName='serverless-rest-api-with-dynamodb-teams-dev',
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
            TableName='serverless-rest-api-with-dynamodb-teams-dev',
            Item=initialData)

        # Mock out the Test Event and Path ID
        event = {}
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = team(event, None)
        self.assertEquals(200, res['statusCode'])

if __name__ == '__main__':
    unittest.main()
