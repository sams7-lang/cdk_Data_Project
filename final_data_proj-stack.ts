import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
//import * as iam from '@aws-cdk/aws-iam';
import * as glue from '@aws-cdk/aws-glue';
import * as athena from '@aws-cdk/aws-athena';

const projWorkflowName = 'glue-housing-data-workflow';
const projCrawlerName  = 'glue-housing-data-crawler';
const projBucketName   = 'project-california-grp3-s' 
const glueJobName1     = 'job-extract-data';
const glueJobName2     = 'job-load-data';
const projDbName       = 'housing_pipeline_db';
const defaultGlueRole  = 'AWSGlueServiceRoleDefault';
const PYTHON_VERSION   = '3';
const COMMAND_NAME     = 'pythonshell';
const fname            = '/modified-data/housing-data-curated.csv';
const triggerJob1Name  = 'trigger-glue-job-extract-data';
const triggerJob2Name   = 'trigger-glue-job-transform-data';
const triggerCrawlerName = 'trigger-crawler-housing-data';


export class FinalDataProjStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // Create bucket for raw data
    const project_main_bucket = new s3.Bucket(this, 'projectBucket', {
      bucketName: projBucketName,
      versioned: false,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });


    //upload local data to bucket using same local file structure
    new s3deploy.BucketDeployment(this, 'DeployProjectBucket', {
      sources: [s3deploy.Source.asset('./MISC')],
      destinationBucket: project_main_bucket,
      retainOnDelete: false
    }); 

    //Glue job 1: deploys script to get housing data
    new glue.CfnJob(this, 'extract-data', {
      name: glueJobName1,
      role: defaultGlueRole,
      command: {
        name: COMMAND_NAME,
        pythonVersion: PYTHON_VERSION,
        scriptLocation: 's3://' + projBucketName + '/glue-scripts-python/extracting-housing-data.py'
      } 
    });

    //Glue job 2: deploys script to process and load data 
    new glue.CfnJob(this, 'load-data', {
      name: glueJobName2,
      role: defaultGlueRole,
      command: {
        name: COMMAND_NAME,
        pythonVersion: PYTHON_VERSION,
        scriptLocation: 's3://' + projBucketName + '/glue-scripts-python/transform-housing-data.py'
      },
    });



    // Create bucket for athena query results 

    /*// Create a new Role for Glue
    const role = new iam.Role(this, 'access-glue-buck', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
    });
    
    // Add AWSGlueServiceRole to role.
    const gluePolicy = iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSGlueServiceRole");
    role.addManagedPolicy(gluePolicy);*/

     //creates a glue data base
      const housing_db = new glue.Database(this, 'work-flow-Database', {
      databaseName: projDbName,
    }); 


    //creates a table in the glue catalog (using glue crawler)
    new glue.CfnCrawler(this, 'proj-data-Crawler', {
      name: projCrawlerName,
      role: defaultGlueRole,
      databaseName: projDbName,
      targets: {
        s3Targets: [{path: project_main_bucket.bucketName + fname}]
      },
      schemaChangePolicy: {
        deleteBehavior: 'DEPRECATE_IN_DATABASE',
        updateBehavior: 'UPDATE_IN_DATABASE',
      },
    });


    // Create glue Work flow 
    new glue.CfnWorkflow(this, 'project-Work-flow',{
      description: 'automate ETL processes',
      name: projWorkflowName,
    }); 

    new glue.CfnTrigger(this, triggerJob1Name, {
      actions: [{
        jobName: glueJobName1,
      }],
      type: "ON_DEMAND",
      description: 'Trigger to run extract job',
      name: triggerJob1Name,
      workflowName: projWorkflowName,
    });

   
    // create trigger to load gluejob2 (process and load data) 
    new glue.CfnTrigger(this, triggerJob2Name, {
      name: triggerJob2Name,
      workflowName: projWorkflowName,
      actions: [{
        jobName: glueJobName2,
      }],
      type: 'CONDITIONAL',
      description:'Triggers Transform data job',
      // predicate for trigger
      predicate: {
        conditions: [{
          jobName:glueJobName1,
          state: 'SUCCEEDED',
          logicalOperator: 'EQUALS',
        }],
        logical: 'ANY',
      },
      startOnCreation: true,
    });  

    // Create trigger for glue profile crawler 
    new glue.CfnTrigger(this, triggerCrawlerName, {
      name: triggerCrawlerName,
      workflowName: projWorkflowName,
      actions: [{
        crawlerName: projCrawlerName,
      }],
      type: 'CONDITIONAL',
      description: 'Trigger to crawl modified data',
      predicate: {
        conditions: [{
          jobName: glueJobName2,
          state: 'SUCCEEDED',
          logicalOperator: 'EQUALS',
        }],
        logical: 'ANY',
      },
      startOnCreation: true,
    });

    // Creates Named Queries
    const athenaQuery = new athena.CfnNamedQuery(this, 'athenaNamedQuery', {
      database: projDbName,
      queryString: 'SELECT * FROM "housing_pipeline_db"."housing-data-modified" limit 10;',
      description: 'Sample Query for housing Data',
      name: 'housing_data_Query',
    });  

  }
} 