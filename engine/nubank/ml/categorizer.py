import os

import numpy as np
import requests
from joblib import load
from supabase import create_client


class Categorizer:

    # Paths to the model, TF-IDF vectorizer, and scaler

    # Queries to select data
    QUERY_ACCOUNT = "id, title, detail, amount"
    QUERY_TRANSACTION = "id, title, description, amount"

    def __init__(self, url, key):
        MODEL_PATH = 'ml/random_forest_model.joblib'
        TFIDF_PATH = 'ml/tfidf_vectorizer.joblib'
        SCALER_PATH = 'ml/scaler.joblib'
        self.url = url
        self.key = key
        self.supabase = create_client(url, key)
        self.headers = {
            "apikey": key,
            "Authorization": "Bearer " + key,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        }
        # Load the trained Random Forest model, TF-IDF vectorizer, and StandardScaler
        self.model = load(MODEL_PATH)
        self.tfidf_vectorizer = load(TFIDF_PATH)
        self.scaler = load(SCALER_PATH)

    # Function to predict and update category_id
    def predict_and_update(self, query, table_name, column_name_sort):
        # Get data from Supabase
        response = self.supabase.table(table_name).select(query)\
            .filter('category_id', 'is', 'null')\
            .order(column_name_sort)\
            .execute()
        # check the number of rows
        if(len(response.data) == 0):
            print('No new rows to update')
            return

        data = response.data

        # filter off the rows that title contains 'Dinheiro resgatado', 'Dinheiro guardado', 'Pagamento da fatura'
        data = [item for item in data if 'title' in item and \
                'Dinheiro resgatado' not in item['title']\
                      and 'Dinheiro guardado' not in item['title']\
                          and 'Pagamento da fatura' not in item['title'] and\
                              'Transferência recebida' not in item['title']]

        if(len(data) == 0):
            print('No new rows to update')
            return
        
        # Prepare data
        titles = []
        if(table_name == 'account_transactions'):
            titles = [item['title'] + " " + item['title'] + " " + item["detail"] for item in data]
        else:
            titles = [item['description'] for item in data]
        amounts = [item['amount'] for item in data]
        titles_tfidf = self.tfidf_vectorizer.transform(titles).toarray()
        features = np.hstack((titles_tfidf, np.array(amounts).reshape(-1, 1)))
        features_scaled = self.scaler.transform(features)

        # Predict categories    
        predicted_categories = self.model.predict(features_scaled)

        for index, (item, predicted_category) in enumerate(zip(data, predicted_categories)):
            # The `update()` method takes a dictionary as its argument.
            rounded_category = round(predicted_category)
            update_data = {'category_id': rounded_category}

            urlPatch = self.url+'/rest/v1/'+table_name + '?id=eq.'+ item['id']
            response = requests.patch(urlPatch, json=update_data, headers=self.headers)
            print(response.status_code)
            print('updated the id ', item['id'])

        print("Categories updated successfully.")
