# cdk_Data_Project  
## File overview:  

### TypeScript CDK scripts:  
**final_data_proj-stack.ts** :  The main CDK script written in TypeScript. Configures a stack, bucket, crawler, and workflow. The workflow includes triggers to initate two ETL jobs and the crawler. The script also creates a simple Athena query from the resulting table. 

### ETL Python scripts:  
**census-api2.py** : Old ETL script created to run external of AWS.  
**extracting-housing-data.py** : Accesses the Census Data API to collect a chosen list of datafields over a span of 10 years. Uploads the raw data as a csv into S3.  
**transform-housing-data.py** : Retrieves the raw data from S3 and runs through the transformation procedure. This included calculating new datafields, splitting location strings, and creating a primary key for the table. Uploads the transformed data as a csv once again to S3 to be crawled.  
