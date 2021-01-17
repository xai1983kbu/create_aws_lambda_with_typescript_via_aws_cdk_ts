# Example how to create AWS Lambda function with Typescript via AWS CDK (also with Typescript)

This example based on next resources:
- https://www.youtube.com/watch?v=MT8LZptY7qg&lc=UgzZ_qYURrf2PxBi15B4AaABAg.9IPn-hiswO-9Ia6G2cbtp8
- https://github.com/fullstackdotdev/aws-cdk/releases/tag/v0.1.0

## Prerequisites:
1. AWS CDK is installed globally (or locally then you can use `npx cdk ...`).
2. AWS CLI is installed globally.

How to work with cdk via typescript -
- https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-typescript.html

How to install aws cli -
- https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

## Steps to create code, deploy it to the cloud and check result:
### Creating a project
```
mkdir aws-lambda-cdk
cd aws-lambda-cdk
cdk init app --language typescript
```

### Install dependecy on project level:
```
npm i "@aws-cdk/aws-lambda" -s
```

### Change code for stack in file `/lib/aws-lambda-cdk-stack.ts`
```
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export class AwsLambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'AwsLambdaCdkStack', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lib/aws-lambda/dist'),
      handler: 'index.handler'
    });
  }
}
```

### Create code for building source code of lambda function
```
cd lib
mkdir aws-lambda
npm i -y
npm i @types/node typescript -D
npm i axios -s
touch tsconfig.json
cd aws-lambda
mkdir src && touch index.js
```

index.js
```
import axios from 'axios';

export const handler = async (event: unknown): Promise<unknown> => {
    const result = await axios.get(
        'https://jsonplaceholder.typicode.com/todos'
    );
    // console.log(result.data);
    return {
        statusCode: 200,
        body: JSON.stringify({ event: event, result: result.data })
    };
};
```

<details><summary>click to see code for - lib/aws-lambda/tsconfig.json</summary>

```
{
    "compilerOptions": {
      "incremental": true /* Enable incremental compilation */,
      "target": "ESNEXT" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */,
      "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,
      "lib": [
        "ESNext"
      ] /* Specify library files to be included in the compilation. */,
      "allowJs": true /* Allow javascript files to be compiled. */,
      "checkJs": true /* Report errors in .js files. */,
      "declaration": true /* Generates corresponding '.d.ts' file. */,
      "declarationMap": true /* Generates a sourcemap for each corresponding '.d.ts' file. */,
      "sourceMap": true, /* Generates corresponding '.map' file. */
      "outDir": "./dist" /* Redirect output structure to the directory. */,
      "removeComments": true /* Do not emit comments to output. */,
      "strict": true /* Enable all strict type-checking options. */,
      "noUnusedLocals": true /* Report errors on unused locals. */,
      "noUnusedParameters": true /* Report errors on unused parameters. */,
      "noImplicitReturns": true /* Report error when not all code paths in function return a value. */,
      "noFallthroughCasesInSwitch": true /* Report errors for fallthrough cases in switch statement. */,
      "moduleResolution": "node" /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */,
      "baseUrl": "./src" /* Base directory to resolve non-absolute module names. */,
      "typeRoots": [
        "./node_modules/@types"
      ], /* List of folders to include type definitions from. */
      "allowSyntheticDefaultImports": true /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */,
      "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
      "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */,
      "resolveJsonModule": true,
      "pretty": false,
      "skipLibCheck": true,
    },
    "include": [
      "src/"
    ],
    "exclude": [
      "node_modules",
    ],
    "compileOnSave": false,
    "typeAcquisition": {
      "enable": false
    }
  }
```

</details>

### Add scrtipts to file lib/aws-lambda/package.json
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "npx tsc",
    "postbuild": "cp package.json package-lock.json dist/ && cd dist && npm install --only=production"
  },
```

### Build source code of lambda function
From the folder `lib/aws-lambda` run the next command
```
npm run build
```

### Deploy lambda function to AWS
From the root folder of the project run the next command:
```
cdk deploy
```
Confirm deployment proccess by selecting yes in terminal promt

### Preparaion for result checking
We will run deployed lambda function via AWS CLI:
```
cd lib
touch bash.sh
```

lib/bash.sh
```
aws lambda invoke \
    --cli-binary-format raw-in-base64-out \
    --function-name AwsLambdaCdkStack-AwsLambdaCdkStack9F38147E-1XEGBVFS8R7ZT \
    --invocation-type RequestResponse \
    --payload '{ "name": "Bob" }' \
    response.json
```

### Check result:
```
cd lib
bash ./bash.sh
```
The expected outcome should be file `response.json` in `lib` folder.

##### One more thanks for https://github.com/fullstackdotdev
