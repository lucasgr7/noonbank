import csv
from pynubank import Nubank, MockHttpClient
from util import export_to_csv

nu = Nubank()
nu.authenticate_with_cert('cpf', 'password', './cert.p12')

has_next_page = True
current_page_number = 1
cursor = None
limit = 0
storage = []


def flatten_dict(data):
    node = data['node']
    return {
        'showClock': node['showClock'],
        'displayDate': node['displayDate'],
        'footer': node['footer'],
        'title': node['title'],
        'detailsDeeplink': node['detailsDeeplink'],
        'id': node['id'],
        'strikethrough': node['strikethrough'],
        'kind': node['kind'],
        'iconKey': node['iconKey'],
        'postDate': node['postDate'],
        'detail': node['detail'],
        'amount': node['amount']
    }

# Fields to be written in CSV
fields = ['tags', 'showClock', 'displayDate', 'footer', 'title', 'detailsDeeplink', 'id', 'strikethrough', 'kind', 'iconKey', 'postDate', 'detail', 'amount']

# Create or open the CSV file
with open('output.csv', mode='w', newline='') as csv_file:
    writer = csv.DictWriter(csv_file, fieldnames=fields)
    writer.writeheader()

    has_next_page = True
    cursor = None
    limit = 0
    current_page_number = 1
    storage = []

    while has_next_page and limit < 250:
        feed = nu.get_account_statements_paginated(cursor)

        # Flattening the feed['edges'] and append to storage
        flat_edges = [flatten_dict(row) for row in feed['edges']]
        storage.extend(flat_edges)

        has_next_page = feed['pageInfo']['hasNextPage']
        cursor = feed['edges'][-1]['cursor']
        current_page_number += 1
        limit += 1

    # Write to CSV
    for row in storage:
        writer.writerow(row)

print('Extraction complete.')