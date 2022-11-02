"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalDataProjStack = void 0;
const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
//import * as iam from '@aws-cdk/aws-iam';
const glue = require("@aws-cdk/aws-glue");
const luxon_1 = require("luxon");
//get current date time
const curr_date = luxon_1.DateTime.now().toLocaleString(luxon_1.DateTime.DATE_FULL);
const projWorkflowName = 'glue-data-workflow';
const projCrawlerName = 'glue-data-crawler';
const projBucketName = 'project_california_grp3' + '_' + curr_date;
const projDbName = 'housing_pipeline_db';
const processJobName = 'process-Housing-Data';
const defaultGlueRole = 'AWSGlueServiceRoleDefault';
const scriptBucketName = 'scripts-pyspark-123';
class FinalDataProjStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        // Project bucket: 
        //    contains: housing-data-store, glue scripts
        const project_data_bucket = new s3.Bucket(this, 'projectDataBucket', {
            bucketName: projBucketName,
            versioned: false,
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.RETAIN
        });
        //upload local data to bucket using same local file structure
        new s3deploy.BucketDeployment(this, 'DeployDataBucket', {
            sources: [s3deploy.Source.asset('./Project_california_grp3')],
            destinationBucket: project_data_bucket,
            retainOnDelete: false
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
        //const scriptLocation   = glues3Bucket.bucketName + '/process-data.py'
        // Glue job
        /*     const glueJobProcessData = new glue.CfnJob(this, 'process-housing-data-job', {
          name: processJobName,
          role: Grole,
          command: {
            name: 'Glue_ETL',
            pythonVersion: glue.PythonVersion.THREE,
            scriptLocation: scriptLocation,
          },
          glueVersion: '1.0',
        }); */
        /*    //creates a table in the glue catalog (using glue crawler)
           new glue.CfnCrawler(this, 'proj-data-Crawler', {
             name: projCrawlerName,
             role: defaultGlueRole,
             databaseName: projDbName,
             targets: {
               s3Targets: [{path: project_data_bucket.bucketName}]
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
       
           // Create trigger for glue profile crawler
           new glue.CfnTrigger(this, 'trigger_crawler', {
             name:'Run-crawler-housing-data',
             workflowName: projWorkflowName,
             actions: [{
               crawlerName: projCrawlerName,
             }],
             type: 'ON_DEMAND',
           });
       
           // Creates Named Queries
           const athenaQuery = new athena.CfnNamedQuery(this, 'athenaNamedQuery', {
             database: projDbName,
             queryString: 'SELECT * FROM "housing_pipeline_db"."housing-data-modified" limit 10;',
             description: 'Sample Query for housing Data',
             name: 'housing_data_Query',
           });  */
    }
}
exports.FinalDataProjStack = FinalDataProjStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluYWxfZGF0YV9wcm9qLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmluYWxfZGF0YV9wcm9qLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxzQ0FBc0M7QUFDdEMsdURBQXVEO0FBQ3ZELDBDQUEwQztBQUMxQywwQ0FBMEM7QUFFMUMsaUNBQWlDO0FBRWpDLHVCQUF1QjtBQUN2QixNQUFNLFNBQVMsR0FBRyxnQkFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRXBFLE1BQU0sZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUM7QUFDOUMsTUFBTSxlQUFlLEdBQUksbUJBQW1CLENBQUM7QUFDN0MsTUFBTSxjQUFjLEdBQUsseUJBQXlCLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztBQUNyRSxNQUFNLFVBQVUsR0FBUyxxQkFBcUIsQ0FBQztBQUMvQyxNQUFNLGNBQWMsR0FBSyxzQkFBc0IsQ0FBQztBQUNoRCxNQUFNLGVBQWUsR0FBSSwyQkFBMkIsQ0FBQztBQUNyRCxNQUFNLGdCQUFnQixHQUFHLHFCQUFxQixDQUFDO0FBSS9DLE1BQWEsa0JBQW1CLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0MsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFDN0MsbUJBQW1CO1FBQ25CLGdEQUFnRDtRQUNoRCxNQUFNLG1CQUFtQixHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDbkUsVUFBVSxFQUFFLGNBQWM7WUFDMUIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNO1NBQ3hDLENBQUMsQ0FBQztRQUVILDZEQUE2RDtRQUM3RCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDdEQsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUM3RCxpQkFBaUIsRUFBRSxtQkFBbUI7WUFDdEMsY0FBYyxFQUFFLEtBQUs7U0FDdEIsQ0FBQyxDQUFDO1FBR0gsMENBQTBDO1FBRTFDOzs7Ozs7OzRDQU9vQztRQUVwQywwQkFBMEI7UUFDeEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUNqRSxZQUFZLEVBQUUsVUFBVTtTQUN6QixDQUFDLENBQUM7UUFFSCx1RUFBdUU7UUFFdkUsV0FBVztRQUNYOzs7Ozs7Ozs7Y0FTTTtRQUdUOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBb0NVO0lBR1QsQ0FBQztDQUNGO0FBN0ZELGdEQTZGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdAYXdzLWNkay9hd3MtczMtZGVwbG95bWVudCc7XG4vL2ltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGdsdWUgZnJvbSAnQGF3cy1jZGsvYXdzLWdsdWUnO1xuaW1wb3J0ICogYXMgYXRoZW5hIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdGhlbmEnO1xuaW1wb3J0IHsgRGF0ZVRpbWUgfSBmcm9tICdsdXhvbic7XG5cbi8vZ2V0IGN1cnJlbnQgZGF0ZSB0aW1lXG5jb25zdCBjdXJyX2RhdGUgPSBEYXRlVGltZS5ub3coKS50b0xvY2FsZVN0cmluZyhEYXRlVGltZS5EQVRFX0ZVTEwpO1xuXG5jb25zdCBwcm9qV29ya2Zsb3dOYW1lID0gJ2dsdWUtZGF0YS13b3JrZmxvdyc7XG5jb25zdCBwcm9qQ3Jhd2xlck5hbWUgID0gJ2dsdWUtZGF0YS1jcmF3bGVyJztcbmNvbnN0IHByb2pCdWNrZXROYW1lICAgPSAncHJvamVjdF9jYWxpZm9ybmlhX2dycDMnICsgJ18nICsgY3Vycl9kYXRlO1xuY29uc3QgcHJvakRiTmFtZSAgICAgICA9ICdob3VzaW5nX3BpcGVsaW5lX2RiJztcbmNvbnN0IHByb2Nlc3NKb2JOYW1lICAgPSAncHJvY2Vzcy1Ib3VzaW5nLURhdGEnO1xuY29uc3QgZGVmYXVsdEdsdWVSb2xlICA9ICdBV1NHbHVlU2VydmljZVJvbGVEZWZhdWx0JztcbmNvbnN0IHNjcmlwdEJ1Y2tldE5hbWUgPSAnc2NyaXB0cy1weXNwYXJrLTEyMyc7XG5cblxuXG5leHBvcnQgY2xhc3MgRmluYWxEYXRhUHJvalN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIFRoZSBjb2RlIHRoYXQgZGVmaW5lcyB5b3VyIHN0YWNrIGdvZXMgaGVyZVxuICAgIC8vIFByb2plY3QgYnVja2V0OiBcbiAgICAvLyAgICBjb250YWluczogaG91c2luZy1kYXRhLXN0b3JlLCBnbHVlIHNjcmlwdHNcbiAgICBjb25zdCBwcm9qZWN0X2RhdGFfYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAncHJvamVjdERhdGFCdWNrZXQnLCB7XG4gICAgICBidWNrZXROYW1lOiBwcm9qQnVja2V0TmFtZSxcbiAgICAgIHZlcnNpb25lZDogZmFsc2UsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTlxuICAgIH0pO1xuXG4gICAgLy91cGxvYWQgbG9jYWwgZGF0YSB0byBidWNrZXQgdXNpbmcgc2FtZSBsb2NhbCBmaWxlIHN0cnVjdHVyZVxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lEYXRhQnVja2V0Jywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldCgnLi9Qcm9qZWN0X2NhbGlmb3JuaWFfZ3JwMycpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBwcm9qZWN0X2RhdGFfYnVja2V0LFxuICAgICAgcmV0YWluT25EZWxldGU6IGZhbHNlXG4gICAgfSk7XG5cblxuICAgIC8vIENyZWF0ZSBidWNrZXQgZm9yIGF0aGVuYSBxdWVyeSByZXN1bHRzIFxuXG4gICAgLyovLyBDcmVhdGUgYSBuZXcgUm9sZSBmb3IgR2x1ZVxuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ2FjY2Vzcy1nbHVlLWJ1Y2snLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZ2x1ZS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgXG4gICAgLy8gQWRkIEFXU0dsdWVTZXJ2aWNlUm9sZSB0byByb2xlLlxuICAgIGNvbnN0IGdsdWVQb2xpY3kgPSBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXCJzZXJ2aWNlLXJvbGUvQVdTR2x1ZVNlcnZpY2VSb2xlXCIpO1xuICAgIHJvbGUuYWRkTWFuYWdlZFBvbGljeShnbHVlUG9saWN5KTsqL1xuXG4gICAgLy9jcmVhdGVzIGEgZ2x1ZSBkYXRhIGJhc2VcbiAgICAgIGNvbnN0IGhvdXNpbmdfZGIgPSBuZXcgZ2x1ZS5EYXRhYmFzZSh0aGlzLCAnd29yay1mbG93LURhdGFiYXNlJywge1xuICAgICAgZGF0YWJhc2VOYW1lOiBwcm9qRGJOYW1lLFxuICAgIH0pO1xuXG4gICAgLy9jb25zdCBzY3JpcHRMb2NhdGlvbiAgID0gZ2x1ZXMzQnVja2V0LmJ1Y2tldE5hbWUgKyAnL3Byb2Nlc3MtZGF0YS5weSdcblxuICAgIC8vIEdsdWUgam9iXG4gICAgLyogICAgIGNvbnN0IGdsdWVKb2JQcm9jZXNzRGF0YSA9IG5ldyBnbHVlLkNmbkpvYih0aGlzLCAncHJvY2Vzcy1ob3VzaW5nLWRhdGEtam9iJywge1xuICAgICAgbmFtZTogcHJvY2Vzc0pvYk5hbWUsXG4gICAgICByb2xlOiBHcm9sZSxcbiAgICAgIGNvbW1hbmQ6IHtcbiAgICAgICAgbmFtZTogJ0dsdWVfRVRMJyxcbiAgICAgICAgcHl0aG9uVmVyc2lvbjogZ2x1ZS5QeXRob25WZXJzaW9uLlRIUkVFLFxuICAgICAgICBzY3JpcHRMb2NhdGlvbjogc2NyaXB0TG9jYXRpb24sXG4gICAgICB9LFxuICAgICAgZ2x1ZVZlcnNpb246ICcxLjAnLFxuICAgIH0pOyAqL1xuXG5cbiAvKiAgICAvL2NyZWF0ZXMgYSB0YWJsZSBpbiB0aGUgZ2x1ZSBjYXRhbG9nICh1c2luZyBnbHVlIGNyYXdsZXIpXG4gICAgbmV3IGdsdWUuQ2ZuQ3Jhd2xlcih0aGlzLCAncHJvai1kYXRhLUNyYXdsZXInLCB7XG4gICAgICBuYW1lOiBwcm9qQ3Jhd2xlck5hbWUsXG4gICAgICByb2xlOiBkZWZhdWx0R2x1ZVJvbGUsXG4gICAgICBkYXRhYmFzZU5hbWU6IHByb2pEYk5hbWUsXG4gICAgICB0YXJnZXRzOiB7XG4gICAgICAgIHMzVGFyZ2V0czogW3twYXRoOiBwcm9qZWN0X2RhdGFfYnVja2V0LmJ1Y2tldE5hbWV9XVxuICAgICAgfSxcbiAgICAgIHNjaGVtYUNoYW5nZVBvbGljeToge1xuICAgICAgICBkZWxldGVCZWhhdmlvcjogJ0RFUFJFQ0FURV9JTl9EQVRBQkFTRScsXG4gICAgICAgIHVwZGF0ZUJlaGF2aW9yOiAnVVBEQVRFX0lOX0RBVEFCQVNFJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgZ2x1ZSBXb3JrIGZsb3cgXG4gICAgbmV3IGdsdWUuQ2ZuV29ya2Zsb3codGhpcywgJ3Byb2plY3QtV29yay1mbG93Jyx7XG4gICAgICBkZXNjcmlwdGlvbjogJ2F1dG9tYXRlIEVUTCBwcm9jZXNzZXMnLFxuICAgICAgbmFtZTogcHJvaldvcmtmbG93TmFtZSxcbiAgICB9KTsgXG5cbiAgICAvLyBDcmVhdGUgdHJpZ2dlciBmb3IgZ2x1ZSBwcm9maWxlIGNyYXdsZXIgXG4gICAgbmV3IGdsdWUuQ2ZuVHJpZ2dlcih0aGlzLCAndHJpZ2dlcl9jcmF3bGVyJywge1xuICAgICAgbmFtZTonUnVuLWNyYXdsZXItaG91c2luZy1kYXRhJyxcbiAgICAgIHdvcmtmbG93TmFtZTogcHJvaldvcmtmbG93TmFtZSxcbiAgICAgIGFjdGlvbnM6IFt7XG4gICAgICAgIGNyYXdsZXJOYW1lOiBwcm9qQ3Jhd2xlck5hbWUsXG4gICAgICB9XSxcbiAgICAgIHR5cGU6ICdPTl9ERU1BTkQnLFxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlcyBOYW1lZCBRdWVyaWVzXG4gICAgY29uc3QgYXRoZW5hUXVlcnkgPSBuZXcgYXRoZW5hLkNmbk5hbWVkUXVlcnkodGhpcywgJ2F0aGVuYU5hbWVkUXVlcnknLCB7XG4gICAgICBkYXRhYmFzZTogcHJvakRiTmFtZSxcbiAgICAgIHF1ZXJ5U3RyaW5nOiAnU0VMRUNUICogRlJPTSBcImhvdXNpbmdfcGlwZWxpbmVfZGJcIi5cImhvdXNpbmctZGF0YS1tb2RpZmllZFwiIGxpbWl0IDEwOycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NhbXBsZSBRdWVyeSBmb3IgaG91c2luZyBEYXRhJyxcbiAgICAgIG5hbWU6ICdob3VzaW5nX2RhdGFfUXVlcnknLFxuICAgIH0pOyAgKi9cblxuXG4gIH1cbn0gIl19