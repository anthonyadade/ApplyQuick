from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import json

with open('labeled_fields.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Combine text fields into a single string
texts = [f"{x.get('type')} {x.get('id')} {x.get('name')} {x.get('autocomplete')} {x.get('aria-label')} {x.get('placeholder')} \
         {x.get('data-label')} {x.get('class')} {x.get('role')} {x.get('autocomplete')} {x.get('aria-labelledby')}" for x in data]
labels = [x['label'] for x in data]

# Splits the data into training and test sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2)

# Processing steps for our data
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),                 # Turns text into numerical vectors that ml model can understand
    ('clf', LogisticRegression(max_iter=1000))    # Classifier that will learn to predict label
])

# Trains the pipeline on our training data.
# The TfidfVectorizer learns which words are important for each label.
# The LogisticRegression model learns patterns in the vectorized data to predict the correct label for new, unseen form fields.
pipeline.fit(X_train, y_train)

print("Test Accuracy:", pipeline.score(X_test, y_test))
