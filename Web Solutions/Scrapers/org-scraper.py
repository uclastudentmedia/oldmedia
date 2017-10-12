"""
Scrapes https://sa.ucla.edu/RCO/public/search
"""

import requests
import json
#import csv
import unicodecsv as csv
import sys
from time import sleep

def main():
    if len(sys.argv) != 2:
        print "Usage: " + sys.argv[0] + " [output file]"
        sys.exit(1)
    
    output_file = sys.argv[1]
    writer = csv.writer(open(output_file, "w"))

    fields = [
        'OrganizationName', 
        'OrganizationID',
        'OrganizationEmail',
        'OrganizationWebSite',
        'PhoneNo',
        'Sig1Name',
        'Sig2Name',
        'Sig3Name',
        'AdvisorName',
        'MemberType',
        'Category1Name',
        'Category2Name',
        #'OrganizationDescription',
    ]

    # header
    writer.writerow(fields)


    url = 'https://sa.ucla.edu/RCO/Public/SearchOrganizations'
    category = 1

    # get data
    while category < 78:
        print 'category = ' + str(category)
        payload = {'value': category, 'type': False, 'radio': "All"}
        req = requests.post(url, data=payload)
        results = json.loads(req.content)

        for org in results:
            org_fields = map(lambda f: org[f], fields)
            writer.writerow(org_fields)

        category += 1
        sleep(1)



if __name__ == '__main__':
    main()
