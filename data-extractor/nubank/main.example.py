from credit_card_transaction import CreditCardTransaction
from account_transaction import AccountTransaction

urlAccountTransaction = 'http://192.168.15.10:8000/rest/v1/account_transactions'
url = 'http://192.168.15.10:8000/rest/v1/transactions'
apikey = 'apikey'
cpf = '123'
password = ''
account_transactions = AccountTransaction(urlAccountTransaction, apikey, 10, cpf, password)
credit_card_transcations = CreditCardTransaction(url, apikey, cpf, password)

print('Extracting credit card transactions...')
credit_card_transcations.execute()
print('Extracting account transactions...')
account_transactions.execute()
print('Done!')