import requests
from data.abract_extractor import ExtractorAbstract
from pynubank import Nubank


class CreditCardTransaction(ExtractorAbstract):
    nu = None
    url = ''
    apiKey = ''
    cpf = ''
    password = ''

    def __init__(self, url, apiKey, cpf, password) -> None:
      self.nu = Nubank()
      self.url = url
      self.apiKey = apiKey
      self.cpf = cpf
      self.password = password

    def extract(self):
      transactions = self.nu.get_card_statements()
      limit = 5
      for raw_transaction in transactions:
        try:
          transaction = self.transform(raw_transaction)
          self.send(transaction)
        except Exception as e:
          print('\033[91m' + f"Failed to extract transaction {raw_transaction['id']}: {e}" + '\033[0m')
          limit -= 1
          if limit == 0:
            break
      

    def transform(self, transaction):
      return {
          "details_status": transaction.get('details_status'),
          "description": transaction.get('description'),
          "amount": transaction.get('amount'),
          "amount_without_iof": transaction.get('amount_without_iof'),
          "details_fx_exchange_rate": transaction.get('details_fx_exchange_rate'),
          "title": transaction.get('title'),
          "details_fx_precise_amount_usd": transaction.get('details_fx_precise_amount_usd'),
          "id": transaction.get('id'),
          "account": transaction.get('account'),
          "category": transaction.get('category'),
          "details_subcategory": transaction.get('details_subcategory'),
          "details_fx_currency_origin": transaction.get('details_fx_currency_origin'),
          "time": transaction.get('time'),
          "details_charges_amount": transaction.get('details_charges_amount'),
          "details_fx_amount_usd": transaction.get('details_fx_amount_usd'),
      }
    
    def send(self, transaction):
      headers = {
          "apikey": self.apiKey,
          "Authorization": "Bearer " + self.apiKey,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
      }
      # Send POST request to Supabase
      response = requests.post(self.url, json=transaction, headers=headers)

      # Check for success
      if response.status_code == 201:
          print(f"Inserted transaction {transaction['id']}")
          print('\033[94m' + f"sending transaction {transaction['id']}" + '\033[0m')
      elif response.status_code == 409:  # Conflict (duplicate)
          print(f"Stoped at duplicate transaction {transaction['id']}")
          raise Exception('Stoped at duplicate transaction')
      else:
          print(f"Failed to insert transaction {transaction['id']}: {response}")
    
    def execute(self):
      self.nu.authenticate_with_cert(self.cpf, self.password, './cert.p12')
      self.extract()
