import requests
import pandas as pd

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

years = ['20'+str(i) for i in range(10,21)]
# Query from Census API for a range of years and concatenate to one dataframe.
for x in reversed(years):
        df2 = accessAPI(x)

        try:
                df = pd.concat([df2, df], sort=False, ignore_index=True)
        except:
                df = df2

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

# Calculate percentage of householders who work.
df['work_perc'] = 1 - (df['household_nowork'] / df['household_size'])
del df['household_nowork']
del df['household_size']
df['work_perc'] = df['work_perc'].map('{:,.2%}'.format)

# Calculate percentage of households living in 2+ unit buildings.
df['perc_2unit'] = (df['married_2unit'] + df['male_2unit'] + df['female_2unit'] + df['nonfamily_2unit']) / df['total_household']
del df['married_2unit']
del df['male_2unit'] 
del df['female_2unit'] 
del df['nonfamily_2unit']
del df['total_household']
df['perc_2unit'] = df['perc_2unit'].map('{:,.2%}'.format)

# Reorder columns to year at beginning.
cols = ['year', 'loc_name', 'population', 'housing_units', 'med_house_value', 
        'med_house_income', 'poverty_perc', 'work_perc', 'perc_2unit']
df = df[cols]
df.reset_index(inplace=True)

#print(df.head(5))

df.to_csv('./housing-data.csv', index=False)  # Export as csv.
