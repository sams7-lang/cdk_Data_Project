import pandas as pd
import boto3
from io import StringIO

aws_s3_bucket = 'project-california-grp3-s'
filePath      = 'raw-data/housing-data-raw.csv'
s3_resource = boto3.resource(
    service_name = 's3',
    region_name = 'us-west-2'
)

# Load in raw data from S3 into a dataframe.
obj = s3_resource.Bucket(aws_s3_bucket).Object(filePath).get()
body = obj['Body']
csv_string = body.read().decode('utf-8')
#df = pd.read_csv(io.BytesIO(obj['Body'].read())
df = pd.read_csv(StringIO(csv_string))

# Change data types.
convert_dict = {'loc_name': str,
        'population': int, 
        'housing_units': int,
        'med_house_value': int,
        'med_house_income': int,
        'poverty_pop': int,
        'household_size': int,
        'household_nowork': int,
        'total_household': int,
        'married_2unit': int,
        'male_2unit': int,
        'female_2unit': int,
        'nonfamily_2unit': int}

df = df.astype(convert_dict)

# Calculate percentage of households below poverty level.
df['poverty_perc'] = df['poverty_pop'] / df['population']
del df['poverty_pop']
df['poverty_perc'] = df['poverty_perc'].map('{:,.2%}'.format)
df['poverty_perc'] = pd.to_numeric(df['poverty_perc'].str.strip('%'))

# Calculate percentage of householders who work.
df['work_perc'] = 1 - (df['household_nowork'] / df['household_size'])
del df['household_nowork']
del df['household_size']
df['work_perc'] = df['work_perc'].map('{:,.2%}'.format)
df['work_perc'] = pd.to_numeric(df['work_perc'].str.strip('%'))

# Calculate percentage of households living in 2+ unit buildings.
df['perc_2unit'] = (df['married_2unit'] + df['male_2unit'] + df['female_2unit'] + df['nonfamily_2unit']) / df['total_household']
del df['married_2unit']
del df['male_2unit'] 
del df['female_2unit'] 
del df['nonfamily_2unit']
del df['total_household']
df['perc_2unit'] = df['perc_2unit'].map('{:,.2%}'.format)
df['perc_2unit'] = pd.to_numeric(df['perc_2unit'].str.strip('%'))

# Reorder columns to year at beginning.
cols = ['year', 'loc_name', 'population', 'housing_units', 'med_house_value', 
        'med_house_income', 'poverty_perc', 'work_perc', 'perc_2unit']
df = df[cols]
df.reset_index(inplace=True)

# Load into S3 to be crawled.
fname = 'modified-data/housing-data-curated.csv'

csv_buffer = StringIO()
df.to_csv(csv_buffer, index=False)
s3_resource.Object(aws_s3_bucket, fname).put(Body=csv_buffer.getvalue())

print(f'{fname} has been uploaded to {aws_s3_bucket}')

