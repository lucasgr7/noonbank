import os
import pickle
from pynubank import Nubank
import requests
import csv

def flatten_dict(d):
    flattened = {}
    for key, value in d.items():
        if isinstance(value, dict):
            for nested_key, nested_value in flatten_dict(value).items():
                flattened[f"{key}_{nested_key}"] = nested_value
        else:
            flattened[key] = value
    return flattened

def export_to_csv(data, filename='transactions.csv'):
    # Flatten the dictionaries
    flattened_data = [flatten_dict(row) for row in data]

    # Extract all the unique keys to use as headers
    headers = set()
    for row in flattened_data:
        headers.update(row.keys())

    # Write the flattened data to CSV
    with open(filename, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        writer.writeheader()
        for row in flattened_data:
            writer.writerow(row)

    print(f"{filename} has been created successfully.")

def filter_transaction(transaction):
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


def insert_transactions(filename='transactions.pkl'):
    # Load transactions from the .pkl file
    with open(filename, 'rb') as file:
        transactions = pickle.load(file)

    url = 'http://192.168.15.10:8000/rest/v1/transactions'
    headers = {
        "apikey": "token",
        "Authorization": "Bearer token",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

    for raw_transaction in transactions:
        # Flatten the transaction if needed (as before)
        # transaction = flatten_dict(transaction)
        transaction = filter_transaction(raw_transaction)

        # Send POST request to Supabase
        response = requests.post(url, json=transaction, headers=headers)

        # Check for success
        if response.status_code == 200:
            print(f"Inserted transaction {transaction['id']}")
        elif response.status_code == 409:  # Conflict (duplicate)
            print(f"Skipped duplicate transaction {transaction['id']}")
        else:
            print(f"Failed to insert transaction {transaction['id']}: {response}")

# Check if statements are cached in a local file
if os.path.exists('transactions.pkl'):
    # Load cached statements
    with open('transactions.pkl', 'rb') as file:
        card_statements = pickle.load(file)
else:
    nu = Nubank()
    # Authenticate with QR code
    uuid, qr_code = nu.get_qr_code()
    qr_code.print_ascii(invert=True)
    input('Após escanear o QRCode pressione enter para continuar')

    nu.authenticate_with_qr_code('cpf', 'senha', uuid)

    # Retrieve card statements and cache them in a local file
    card_statements = nu.get_card_statements()
    with open('card_statements.pkl', 'wb') as file:
        pickle.dump(card_statements, file)

# Now you can use card_statements as needed
#export_to_csv(card_statements)

# Now send the data to supabse
insert_transactions()