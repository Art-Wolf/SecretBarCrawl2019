from list import team

import unittest
import json
import os
import boto3
from moto import mock_dynamodb2

##
# Test the List methods
##
class TestList(unittest.TestCase):

    ##
    # Test a successful teams list
    ##
    @mock_dynamodb2
    def test_list_team(self):

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

        # Set the table environment name
        os.environ['DYNAMODB_TEAM_TABLE'] = 'serverless-rest-api-with-dynamodb-teams-dev'

        # Test
        res = team(None, None)
        self.assertEquals(200, res['statusCode'])
        item_dict = json.loads(res['body'])
        self.assertEquals(1, len(item_dict))

if __name__ == '__main__':
    unittest.main()
