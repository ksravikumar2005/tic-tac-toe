# Tic Tac Toe

A browser-based Tic Tac Toe game for two local players, built with vanilla HTML, CSS, and JavaScript.

## Quick Start

```bash
# Open directly in a browser
open index.html

# Or use any static file server
npx serve .
```

## Development

```bash
npm install
npm test
```

## Project Structure

```
├── index.html          # Game page
├── style.css           # Board styling
├── src/
│   ├── engine.js       # Pure game logic (state, moves, win/draw detection)
│   ├── app.js          # UI rendering and event wiring
│   └── engine.test.js  # Unit tests
├── cloudformation.yaml # AWS CloudFormation (S3 + CloudFront)
└── terraform/          # Terraform equivalent
    └── main.tf
```

## How to Play

- Player X goes first
- Click an empty cell to place your mark
- First to get three in a row (horizontal, vertical, or diagonal) wins
- Click "Restart" to play again

## AWS Deployment

### CloudFormation

```bash
aws cloudformation deploy \
  --template-file cloudformation.yaml \
  --stack-name tic-tac-toe \
  --capabilities CAPABILITY_IAM

# Get the CloudFront URL
aws cloudformation describe-stacks \
  --stack-name tic-tac-toe \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
  --output text

# Upload files to S3
BUCKET=$(aws cloudformation describe-stacks \
  --stack-name tic-tac-toe \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" \
  --output text)

aws s3 sync . s3://$BUCKET \
  --exclude ".*" --exclude "node_modules/*" --exclude "terraform/*" \
  --exclude "cloudformation.yaml" --exclude "package*.json" \
  --exclude "vitest.config.js" --exclude "src/engine.test.js"
```

### Terraform

```bash
cd terraform
terraform init
terraform apply

# Upload files to S3
BUCKET=$(terraform output -raw bucket_name)

aws s3 sync .. s3://$BUCKET \
  --exclude ".*" --exclude "node_modules/*" --exclude "terraform/*" \
  --exclude "cloudformation.yaml" --exclude "package*.json" \
  --exclude "vitest.config.js" --exclude "src/engine.test.js"
```

## Testing

```bash
npm install
npm test
```

Tests cover game state initialization, win/draw detection, move validation, and turn alternation.
