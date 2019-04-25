# API

# Setup

Using [Pipenv](https://pipenv.readthedocs.io/en/latest/) to manage python requirements.

```
$ brew install pipenv
$ pipenv --python /usr/bin/python
```

Configure pipenv to make sure Unit Test requirements are met.

```
$ pipenv install
```

# Unit Tests

```
$ pipenv shell
$ (SecretBarCrawl2019) bash-3.2$ python -m unittest discover -s bars/ -p '*_test.py'
2019-04-09 03:36:05,995 Found credentials in shared credentials file: ~/.aws/credentials
2019-04-09 03:36:06,102 Entering create bar
2019-04-09 03:36:06,102 Received Event: {'body': '{"name": "Test", "address": "245 Summer St, Boston, MA 02125"}'}
2019-04-09 03:36:06,117 Creating Bar: {'updatedAt': 1554795366110, 'address': u'245 Summer St, Boston, MA 02125', 'id': '227586ca-5a9a-11e9-a7ea-88e9fe4f0be6', 'createdAt': 1554795366110, 'name': u'Test'}
2019-04-09 03:36:06,123 Returning Response: {'body': '{"updatedAt": 1554795366110, "address": "245 Summer St, Boston, MA 02125", "id": "227586ca-5a9a-11e9-a7ea-88e9fe4f0be6", "createdAt": 1554795366110, "name": "Test"}', 'statusCode': 200}
.2019-04-09 03:36:06,124 Entering create bar
2019-04-09 03:36:06,124 Received Event: {'body': '{"address": "245 Summer St, Boston, MA 02125"}'}
2019-04-09 03:36:06,124 Couldn't create the bar, no name.
.2019-04-09 03:36:06,124 Entering create bar
2019-04-09 03:36:06,124 Received Event: None
2019-04-09 03:36:06,124 No body supplied in event
.2019-04-09 03:36:06,124 Entering create bar
2019-04-09 03:36:06,124 Received Event: {'body': '{"name": "Test"}'}
2019-04-09 03:36:06,124 Couldn't create the bar, no address.
.2019-04-09 03:36:06,142 Entering update bar
2019-04-09 03:36:06,142 Received Event: {'body': '{"name": "Test", "address": "245 Summer St, Boston, MA 02125"}', 'pathParameters': {'id': '123'}}
2019-04-09 03:36:06,160 Returning Response: {'body': '{"address": "245 Summer St, Boston, MA 02125", "id": "123", "name": "Test", "updatedAt": 1554795366154}', 'statusCode': 200}
.2019-04-09 03:36:06,160 Entering update bar
2019-04-09 03:36:06,160 Received Event: None
2019-04-09 03:36:06,160 No body supplied in event
.2019-04-09 03:36:06,161 Entering update bar
2019-04-09 03:36:06,161 Received Event: {'body': '{"name": "Test"}'}
2019-04-09 03:36:06,161 No bar id supplied in event.
.2019-04-09 03:36:06,172 Entering update bar
2019-04-09 03:36:06,172 Received Event: {'body': '{"name": "Test", "address": "245 Summer St, Boston, MA 02125"}', 'pathParameters': {'id': '123'}}
2019-04-09 03:36:06,187 No Bar to Update
2019-04-09 03:36:06,187 Returning Response: {'body': 'No Bar to Update', 'statusCode': 400}
.
----------------------------------------------------------------------
Ran 8 tests in 0.107s

OK
```

## Exit Pipenv
```
(SecretBarCrawl2019) bash-3.2$ exit
```

# Swagger Spec

Review the swagger spec at https://editor.swagger.io

# Deploying

## API

```
cd api
serverless deploy
```

