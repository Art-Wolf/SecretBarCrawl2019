from create import team

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
    # Tests create team with no Event
    ##
    def test_create_team_empty(self):
        try:
            team(None, None)
        except Exception as e:
            self.assertEquals("No body supplied in event", e.message)

    ##
    # Tests a successful create team
    ##
    @mock_dynamodb2
    def test_create_team(self):

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

        # Mock out the Test Event
        event = {}
        event['body'] = '{"name": "Test Team"}'

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = team(event, None)
        self.assertEquals(200, res['statusCode'])

if __name__ == '__main__':
    unittest.main()
