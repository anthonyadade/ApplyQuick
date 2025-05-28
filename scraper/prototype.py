# prob wont use

from bs4 import BeautifulSoup
import json

# Example HTML inputs from Workday and Greenhouse
html_examples = [
    {
        "source": "Workday",
        "html": '''<input type="text" data-automation-id="email" id="input-4" aria-required="true" aria-invalid="false" autocomplete="email" class="css-1pgg6bx" value="">''',
        "label": "email"
    },
    {
        "source": "Greenhouse",
        "html": '''<input id="email" class="input input__single-line" aria-label="Email" aria-describedby="email-description email-error email-help" aria-invalid="false" aria-errormessage="email-error" aria-required="true" type="text" maxlength="255" autocomplete="email" value="">''',
        "label": "email"
    }
]

def extract_input_attributes(html_string, label):
    soup = BeautifulSoup(html_string, "html.parser")
    input_tag = soup.find("input")
    if not input_tag:
        return None

    # Convert input tag attributes to dictionary
    attributes = dict(input_tag.attrs)
    attributes["label"] = label
    return attributes

# Build the dataset
dataset = [extract_input_attributes(entry["html"], entry["label"]) for entry in html_examples if extract_input_attributes(entry["html"], entry["label"]) is not None]

# Output JSON format of the dataset
dataset_json = json.dumps(dataset, indent=2)
dataset_json[:1000]  # show a preview of the result

