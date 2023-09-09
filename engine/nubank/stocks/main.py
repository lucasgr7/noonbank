# Limit to the last 90 days
data_90_days = data.iloc[:90]

# Moving Averages
data_90_days['5-day MA'] = data_90_days['4. close'].rolling(window=5).mean()
data_90_days['10-day MA'] = data_90_days['4. close'].rolling(window=10).mean()
data_90_days['20-day MA'] = data_90_days['4. close'].rolling(window=20).mean()

# Exponential Moving Averages
data_90_days['5-day EMA'] = data_90_days['4. close'].ewm(span=5).mean()

# Momentum
data_90_days['Momentum'] = data_90_days['4. close'].diff(4)

# Bollinger Bands
data_90_days['20-day STD'] = data_90_days['4. close'].rolling(window=20).std()
data_90_days['Upper Bollinger'] = data_90_days['20-day MA'] + (data_90_days['20-day STD'] * 2)
data_90_days['Lower Bollinger'] = data_90_days['20-day MA'] - (data_90_days['20-day STD'] * 2)

# Drop missing values
data_90_days.dropna(inplace=True)


# Drop missing values
data_90_days.dropna(inplace=True)


# split data
# Create the Buy/Sell signal
data_90_days['Buy/Sell'] = np.where(data_90_days['4. close'].shift(-1) > data_90_days['4. close'], 1, 0)

# Drop the last row as there's no next day for it
data_90_days = data_90_days[:-1]

# Define the features and target variable
features = ['1. open', '2. high', '3. low', '5. volume', '5-day MA', '10-day MA', '20-day MA', '5-day EMA', 'Momentum', 'Upper Bollinger', 'Lower Bollinger']
X = data_90_days[features]
y = data_90_days['Buy/Sell']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)


# evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy}')
