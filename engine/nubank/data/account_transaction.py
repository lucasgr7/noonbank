import requests
from data.abract_extractor import ExtractorAbstract
from pynubank import Nubank


class AccountTransaction(ExtractorAbstract):
    nu = None
    url = ''
    apiKey = ''
    limitIterations = 1000
    cpf = ''
    password = ''

    def __init__(self, url, apiKey, limitIterations, cpf, password) -> None:
      super().__init__()
      self.nu = Nubank()
      self.url = url
      self.apiKey = apiKey
      self.limitIterations = limitIterations
      self.cpf = cpf
      self.password = password

    def extract(self):
      has_next_page = True
      current_page_number = 1
      cursor = None
      limit = 0
      limitTries = 5
      while has_next_page and limit < self.limitIterations:
          try:
            feed = self.nu.get_account_statements_paginated(cursor)

            # Flattening the feed['edges'] and append to storage
            flat_edges = [self.transform(row) for row in feed['edges']]

            has_next_page = feed['pageInfo']['hasNextPage']
            cursor = feed['edges'][-1]['cursor']
            current_page_number += 1
            limit += 1
            self.send(flat_edges)
          except Exception as e:
            print('\033[91m' + f"Failed to extract transaction {e}" + '\033[0m')
            limitTries -= 1
            if limitTries == 0:
              break

    def transform(self, data):
      node = data['node']
      return {
          'showclock': node['showClock'],
          'displaydate': node['displayDate'],
          'footer': node['footer'],
          'title': node['title'],
          'id': node['id'],
          'strikethrough': node['strikethrough'],
          'kind': node['kind'],
          'postdate': node['postDate'],
          'detail': node['detail'],
          'amount': node['amount']
      }

    def send(self, data):
      headers = {
          "apikey": self.apiKey,
          "Authorization": "Bearer " + self.apiKey,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
      }
      for row in data:
        response = requests.post(self.url, json=row, headers=headers)
        if response.status_code == 201:
            print('\033[94m' + f"sending transaction {row['id']}" + '\033[0m')
        elif response.status_code == 409:  # Conflict (duplicate)
            print(f"stoped duplicate transaction {row['id']}")
            raise Exception('stoped duplicate transaction')
        else:
            print(f"Failed to insert transaction {row['id']}: {response}")

    def execute(self):
        self.nu.authenticate_with_cert(self.cpf, self.password, './cert.p12')
        self.extract()