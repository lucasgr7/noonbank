import pandas as pd
from joblib import dump
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Load the data
data_path = 'data-train-model.csv'
data = pd.read_csv(data_path)

# Extract the selected features (title and amount) and target variable
features_selected = data[['title', 'amount']]
target_selected = data['category_id']

# Apply TF-IDF transformation to the "title" column
tfidf_vectorizer = TfidfVectorizer(max_features=500)
title_tfidf = tfidf_vectorizer.fit_transform(features_selected['title'])
title_tfidf_df = pd.DataFrame(title_tfidf.toarray(),
                              columns=tfidf_vectorizer.get_feature_names_out())

# Combine the TF-IDF features with the "amount" feature
final_features_selected = pd.concat([title_tfidf_df, features_selected['amount'].reset_index(drop=True)], axis=1)

# Scale the selected features
scaler = StandardScaler()
final_features_scaled_selected = scaler.fit_transform(final_features_selected)

# Split the data into training and testing sets (80% training, 20% testing)
X_train_selected, X_test_selected, y_train_selected, y_test_selected = train_test_split(final_features_scaled_selected, target_selected, test_size=0.2, random_state=42)

# Train the Random Forest model on the selected data
rf_model_selected = RandomForestClassifier(random_state=42)
rf_model_selected.fit(X_train_selected, y_train_selected)

# Predict the categories on the testing set
y_pred_selected = rf_model_selected.predict(X_test_selected)

# Evaluate the accuracy of the Random Forest model
accuracy = accuracy_score(y_test_selected, y_pred_selected)
print("Accuracy:", accuracy)

# Export the trained Random Forest model
model_export_path = 'random_forest_model.joblib'
dump(rf_model_selected, model_export_path)
print("Model saved to", model_export_path)


# Save the TF-IDF vectorizer
tfidf_export_path = 'tfidf_vectorizer.joblib'
dump(tfidf_vectorizer, tfidf_export_path)
print("TF-IDF saved to", model_export_path)

# Save the StandardScaler
scaler_export_path = 'scaler.joblib'
dump(scaler, scaler_export_path)
print("Scaler saved to", model_export_path)

