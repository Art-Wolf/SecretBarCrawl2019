from createTeam import createTeam

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
#

class testCreatTeam(unittest.TestCase):
    def test_create_team_empty(self):
        try:
            createTeam(None, None)
        except Exception as e:
            self.assertEquals("No ")