from fastapi import FastAPI, Request
from pydantic import BaseModel
import joblib
from model.utils import preprocess_input

app = FastAPI()

model = joblib.load('model/model.joblib')

class FieldInput(BaseModel):
    tag: str
    attributes: dict
    label: str = ""

@app.post("/predict")
def predict_label(field: FieldInput):
    text = preprocess_input(field)
    prediction = model.predict([text])[0]
    return {"label": prediction}