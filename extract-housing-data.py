import requests
import pandas as pd
import boto3
from io import StringIO

#aws_s3_bucket = 's3://housing-data-store/'
aws_s3_bucket = 'housing-data-store'
s3_resource = boto3.resource(
    service_name = 's3',
    region_name = 'us-west-2'
)

# Access key obtained from census.gov.
key = '&key=2257b9f1ce7af2bce554a28136cf053c646627d5'
host = 'https://api.census.gov/data'
dataset = '/acs/acs5'  # American Community Survey 5 year estimates.
g = '?get='

# Define column name and variable code from 
# https://api.census.gov/data/2020/acs/acs5/variables.html
# Only accessing estimate values (_001E). 
vard = {'loc_name': 'NAME',
        'population': 'B01003_001E', 
        'housing_units': 'B25001_001E',
        'med_house_value': 'B25077_001E',
        'med_house_income': 'B19013_001E',
        'poverty_pop': 'B17001_002E',
        'household_size': 'B08202_001E',
        'household_nowork': 'B08202_002E',
        'total_household': 'B11011_001E',
        'married_2unit': 'B11011_005E',
        'male_2unit': 'B11011_010E',
        'female_2unit': 'B11011_014E',
        'nonfamily_2unit': 'B11011_018E'}

var = ','.join(map(str, vard.values()))

location = '&for=county:*&in=state:06'  # Query counties in CA.

def accessAPI(year): 
        
        # Pass query to census API and return as json (list object).
        url = f"{host}/{year}{dataset}{g}{var}{location}{key}"
        print(year)
        response = requests.get(url).json()

        # Drop header and county, country code columns.
        # Rename column names.
        df = pd.DataFrame(response[1:])
        df = df.drop(df.columns[[-1, -2]], axis=1)
        col_names = list(vard.keys())
        df.columns = col_names
        df['year'] = year

        return df
years = [2019, 2020]
#years = ['20'+str(i) for i in range(10,21)]
# Query from Census API for a range of years and concatenate to one dataframe.
for x in reversed(years):
        df2 = accessAPI(x)

        try:
                df = pd.concat([df2, df], sort=False, ignore_index=True)
        except:
                df = df2

# Load dataframe into S3 bucket.
fname = 'housing-data-raw.csv'
path = f'{aws_s3_bucket}/{fname}'
#df.to_csv(f'./{fname}', index=False)  # Export as csv.
csv_buffer = StringIO()
df.to_csv(csv_buffer, index=False)
s3_resource.Object(aws_s3_bucket, fname).put(Body=csv_buffer.getvalue())

#s3_resource.Bucket(aws_s3_bucket).upload_file(
#    Filename=fname, Key=fname
#)
print(f'{fname} has been uploaded to {aws_s3_bucket}')