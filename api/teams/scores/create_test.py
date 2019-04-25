from create import score

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
    # Tests create score with no Event
    ##
    def test_create_score_empty(self):
        try:
            score(None, None)
        except Exception as e:
            self.assertEquals("No body supplied in event", e.message)

    ##
    # Tests create score with no team id
    ##
    def test_create_score_no_id(self):
        event = {}
        event['pathParameters'] = {}
        event['body'] = '{"barId": "456", "score": "40"}'
        
        try:
            score(event, None)
        except Exception as e:
            self.assertEquals("No team id supplied in event.", e.message)


    ##
    # Tests a successful create score
    ##
    @mock_dynamodb2
    def test_create_first_score(self):

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
        event['body'] = '{"barId": "456", "score": "40"}'

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = score(event, None)
        self.assertEquals(200, res['statusCode'])
        data = json.loads(res['body'])
        self.assertEquals(1, len(data['Attributes']['scores']))
        self.assertEquals(40, data['Attributes']['totalScore'])

    ##
    # Tests a successful add score
    ##
    @mock_dynamodb2
    def test_create_add_score(self):

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
        initialData['totalScore'] = { 'S': '4' }
        initialData['scores'] = {'L':[{'M': {'id': { 'S': '456' }, 'barId': { 'S': '789'}, 'score': { 'S': '4' }}}]}

        dynamo.put_item(
            TableName='serverless-rest-api-with-dynamodb-teams-dev',
            Item=initialData)

        # Mock out the Test Event
        event = {}
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'
        event['body'] = '{"barId": "456", "score": "40"}'

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = score(event, None)
        self.assertEquals(200, res['statusCode'])
        data = json.loads(res['body'])
        self.assertEquals(2, len(data['Attributes']['scores']))
        self.assertEquals(44, int(data['Attributes']['totalScore']))

if __name__ == '__main__':
    unittest.main()
