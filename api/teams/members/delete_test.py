from delete import member

import unittest
import datetime
import time
import json
import os
import boto3
from moto import mock_dynamodb2

dynamodb = boto3.resource('dynamodb')

##
# Test the Delete methods
##
class TestDelete(unittest.TestCase):

    ##
    # Tests delete member with no ids
    ##
    def test_delete_member_no_id(self):
        event = {}
        event['pathParameters'] = {}

        try:
            member(event, None)
        except Exception as e:
            self.assertEquals("No team/member id supplied in event.", e.message)

    ##
    # Tests delete member with no member id
    ##
    def test_delete_member_no_member_id(self):
        event = {}
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'

        try:
            member(event, None)
        except Exception as e:
            self.assertEquals("No team/member id supplied in event.", e.message)

    ##
    # Tests delete member with no team id
    ##
    def test_delete_member_no_team_id(self):
        event = {}
        event['pathParameters'] = {}
        event['pathParameters']['memberId'] = '123'

        try:
            member(event, None)
        except Exception as e:
            self.assertEquals("No team/member id supplied in event.", e.message)

    ##
    # Tests a failed delete member when not part of team
    ##
    @mock_dynamodb2
    def test_delete_member_not_found(self):

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
        initialData['members'] = { 'L': [] }

        dynamo.put_item(
            TableName='serverless-rest-api-with-dynamodb-teams-dev',
            Item=initialData)

        # Mock out the Test Event
        event = {}
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'
        event['pathParameters']['memberId'] = '456'

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = member(event, None)
        self.assertEquals(400, res['statusCode'])

    ##
    # Tests a successful delete member
    ##
    @mock_dynamodb2
    def test_delete_member(self):

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
        memberData = {}
        memberData['id'] = { 'S': '456' }
        memberData['name'] = { 'S': 'captain' }

        initialData = {}
        initialData['id'] = { 'S': '123' }
        initialData['name'] = { 'S': 'old' }
        initialData['members'] = {'L':[{'M': {'id': { 'S': '456' }, 'name': { 'S': 'captain'}}}]}

        dynamo.put_item(
            TableName='serverless-rest-api-with-dynamodb-teams-dev',
            Item=initialData)

        # Mock out the Test Event
        event = {}
        event['pathParameters'] = {}
        event['pathParameters']['id'] = '123'
        event['pathParameters']['memberId'] = '456'

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = member(event, None)
        self.assertEquals(200, res['statusCode'])
        data = json.loads(res['body'])
        self.assertEquals(0, len(data['Attributes']['members']))

if __name__ == '__main__':
    unittest.main()
