from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import json
import joblib

with open('../data/labeled_fields.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
#print(' '.join(data[0]['attributes'].values()))
# Combine text fields into a single string
texts = [' '.join(x['attributes'].values()) for x in data]
# texts = [f"{attr.get('type', '')} {attr.get('id', '')} {attr.get('name', '')} {attr.get('autocomplete', '')} {attr.get('aria-label', '')} \
#          {attr.get('placeholder', '')} {attr.get('data-label', '')} {attr.get('class', '')} {attr.get('role', '')} {attr.get('autocomplete', '')} \
#             {attr.get('aria-labelledby', '')}" for x in data for attr in x['attributes']] # each entry in data has an 'attributes' field

# texts = [f"{x.get('type')} {x.get('id')} {x.get('name')} {x.get('autocomplete')} {x.get('aria-label')} {x.get('placeholder')} \
#          {x.get('data-label')} {x.get('class')} {x.get('role')} {x.get('autocomplete')} {x.get('aria-labelledby')}" for x in data]

labels = [x['label'] for x in data]

# Splits the data into training and test sets (80% train, 20% test)
#X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2)
# print(X_train[:50])
# Processing steps for our data
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),                 # Turns text into numerical vectors that ml model can understand
    ('clf', LogisticRegression(max_iter=1000))    # Classifier that will learn to predict label
])

# Trains the pipeline on our training data.
# The TfidfVectorizer learns which words are important for each label.
# The LogisticRegression model learns patterns in the vectorized data to predict the correct label for new, unseen form fields.
#pipeline.fit(X_train, y_train)
pipeline.fit(texts, labels)

joblib.dump(pipeline, 'model.joblib')

# print("Test Accuracy:", pipeline.score(X_test, y_test))
