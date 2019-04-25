# SecretBarCrawl2019
Creating a simple app to manage scoring for a bar crawl? What could be better?

# Swagger Spec

Review the swagger spec at https://editor.swagger.io

# Deploying

## API

```
cd api
serverless deploy
```

### WEB

Update the following files with the correct data:

#### API URL

This is in `web/src/config.js`

#### Website URL

This is in `web/serverless.yml`, as the variable `siteName: game-genius.com`

#### Deploy

```
cd web
npm run deploy
```
