from create import member

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
    # Tests create member with no Event
    ##
    def test_create_member_empty(self):
        try:
            member(None, None)
        except Exception as e:
            self.assertEquals("No body supplied in event", e.message)

    ##
    # Tests a successful create member
    ##
    @mock_dynamodb2
    def test_create_first_member(self):

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

        # Mock out the Test Event
        event = {}
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'
        event['body'] = '{"name": "Test Member"}'

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = member(event, None)
        self.assertEquals(200, res['statusCode'])
        data = json.loads(res['body'])
        self.assertEquals(1, len(data['Attributes']['members']))

    ##
    # Tests a successful append member
    ##
    @mock_dynamodb2
    def test_create_second_member(self):

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
        initialData['members'] = { 'L': [ { 'S': 'captain' } ] }

        dynamo.put_item(
            TableName='serverless-rest-api-with-dynamodb-teams-dev',
            Item=initialData)

        # Mock out the Test Event
        event = {}
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'
        event['body'] = '{"name": "Second Member"}'

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = member(event, None)
        self.assertEquals(200, res['statusCode'])
        data = json.loads(res['body'])
        self.assertEquals(2, len(data['Attributes']['members']))

if __name__ == '__main__':
    unittest.main()
