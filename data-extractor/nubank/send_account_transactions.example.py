import csv
import requests

def filter_transaction(raw_transaction):
    # Implement any necessary transformation logic here
    return {
        "showclock": raw_transaction["showClock"] == 'True',
        "displaydate": raw_transaction["displayDate"],
        "footer": raw_transaction["footer"],
        "title": raw_transaction["title"],
        "id": raw_transaction["id"],
        "strikethrough": raw_transaction["strikethrough"] == 'True',
        "kind": raw_transaction["kind"],
        "postdate": raw_transaction["postDate"],
        "detail": raw_transaction["detail"],
        "amount": float(raw_transaction["amount"])
    }

def insert_transactions(filename='transactions.csv'):
    url = 'http://192.168.15.10:8000/rest/v1/account_transactions'
    headers = {
        "apikey": "token",
        "Authorization": "Bearer token",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

    with open(filename, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for raw_transaction in reader:
            transaction = filter_transaction(raw_transaction)
            response = requests.post(url, json=transaction, headers=headers)

            if response.status_code == 200:
                print(f"Inserted transaction {transaction['id']}")
            elif response.status_code == 409:  # Conflict (duplicate)
                print(f"Skipped duplicate transaction {transaction['id']}")
            else:
                print(f"Failed to insert transaction {transaction['id']}: {response}")
insert_transactions('output.csv')