import random
from faker import Faker
from decimal import Decimal
from supabase_py import create_client
from datetime import datetime

# Connect to Supabase
supabase_url = ""
supabase_key = ""
supabase = create_client(supabase_url, supabase_key)

# Generate fake data
fake = Faker()

def generate_transactions():
  data = []
  for _ in range(1000):  # Generate 10 rows of fake data
    row = {
      'details_status': fake.word(),
      'description': fake.sentence(),
      'amount': random.randint(1, 1000),
      'amount_without_iof': random.randint(1, 1000),
      'details_fx_exchange_rate': float(Decimal(random.uniform(0, 10))),
      'title': fake.word(),
      'details_fx_precise_amount_usd': float(Decimal(random.uniform(0, 100))),
      'id': fake.uuid4(),
      'account': fake.uuid4(),
      'category': fake.word(),
      'details_subcategory': fake.word(),
      'details_fx_currency_origin': fake.word(),
      'time': fake.date_time_between(start_date=2021, end_date='now').strftime('%Y-%m-%d %H:%M:%S'),
      'details_charges_amount': float(Decimal(random.uniform(0, 100))),
      'details_fx_amount_usd': random.choice([True, False])
    }
    data.append(row)
  return data

# Generate fake data for the accounts table:
def generate_account_transactions_data():
  data = []
  for _ in range(1000):  # Generate 1000 rows of fake data
    row = {
      'showclock': random.choice([True, False]),
      'displaydate': fake.date_time_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d'),
      'footer': fake.sentence(),
      'title': random.choice(['Transferência recebida', 'Transferência enviada']),
      'id': fake.uuid4(),
      'strikethrough': random.choice([True, False]),
      'kind': fake.word(),
      'postdate': fake.date_time_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d'),
      'detail': fake.sentence(),
      'amount': float(Decimal(random.uniform(0, 10000)))
    }
    data.append(row)
  return data

def generate_categories_data():
  data = []
  for _ in range(100):  # Generate 100 rows of fake data
    row = {
      'name': fake.word(),
      'color_font': '#' + ''.join([random.choice('0123456789ABCDEF') for _ in range(6)]),
      'background_color': '#' + ''.join([random.choice('0123456789ABCDEF') for _ in range(6)])
    }
    data.append(row)
  return data

# Insert fake data into the transactions table
def insert_fake_data():
  # ...
  data = generate_transactions()
  account_transactions = generate_account_transactions_data()
  categories_data = generate_categories_data()
  
  # supabase.table('transactions').insert(data).execute()
  # print(supabase.table('account_transactions').insert(account_transactions).execute())
  print(supabase.table('categories').insert(categories_data).execute())

# Call the function to insert fake data
insert_fake_data()