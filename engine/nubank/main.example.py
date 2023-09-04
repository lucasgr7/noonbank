from data.account_transaction import AccountTransaction
from data.credit_card_transaction import CreditCardTransaction
from ml.categorizer import Categorizer

urlAccountTransaction = 'http://192.168.15.10:8000/rest/v1/account_transactions'
url = 'http://192.168.15.10:8000/rest/v1/transactions'
base_url = 'http://192.168.15.10:8000/'
cpf = ''
password = ''
apikey = ''

def fetch_nubank_data():
    password = ''
    account_transactions = AccountTransaction(urlAccountTransaction, apikey, 10, cpf, password)
    credit_card_transcations = CreditCardTransaction(url, apikey, cpf, password)

    print('Extracting credit card transactions...')
    credit_card_transcations.execute()
    print('Extracting account transactions...')
    account_transactions.execute()
    print('Done!')

def predict_model_update():
  categorizer = Categorizer(base_url, apikey)
  categorizer.predict_and_update(Categorizer.QUERY_ACCOUNT, 'account_transactions')
  categorizer.predict_and_update(Categorizer.QUERY_TRANSACTION, 'transactions')

def run_all():
    fetch_nubank_data()
    predict_model_update()

def main():
    print('Select an option:')
    print('1: Run data fetch from Nubank')
    print('2: Run predict model update')
    print('3: Run all')
    choice = input('Enter your choice (1/2/3): ')

    if choice == '1':
        fetch_nubank_data()
    elif choice == '2':
        predict_model_update()
    elif choice == '3':
        run_all()
    else:
        print('Invalid choice')

if __name__ == '__main__':
    main()
