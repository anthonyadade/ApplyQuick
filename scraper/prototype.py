from bs4 import BeautifulSoup
import json

# Example HTML inputs
html_examples = [
    {
        "source": "Workday",
        "html": '''<input type="text" id="PersonProfileFields.FirstName" name="PersonProfileFields.FirstName" class="iCIMS_Forms_Global customFieldContainer iCIMS_Forms_TextField iCIMS_Forms_Qnull iCIMS_Forms_RequiredField form-control" onchange="pageDirtyFlag=true;" aria-required="true" i_required="true" bgtparse="true" maxlength="192" autocomplete="given-name">''',
        "label": "firstName"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" id="PersonProfileFields.LastName" name="PersonProfileFields.LastName" class="iCIMS_Forms_Global customFieldContainer iCIMS_Forms_TextField iCIMS_Forms_Qnull iCIMS_Forms_RequiredField form-control" onchange="pageDirtyFlag=true;" aria-required="true" i_required="true" bgtparse="true" maxlength="64" autocomplete="family-name">''',
        "label": "lastName"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="email" id="PersonProfileFields.Email" name="PersonProfileFields.Email" class="iCIMS_Forms_Global customFieldContainer iCIMS_Forms_EmailField iCIMS_Forms_Qnull iCIMS_Forms_RequiredField form-control" onchange="pageDirtyFlag=true;" aria-required="true" i_required="true" maxlength="128" autocomplete="email" value="ajadade@rocketmail.com">''',
        "label": "email"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" id="-1_PersonProfileFields.AddressStreet1" name="-1_PersonProfileFields.AddressStreet1" class="iCIMS_Forms_Global customFieldContainer iCIMS_Forms_TextField iCIMS_Forms_Qnull iCIMS_Forms_RequiredField form-control" onchange="pageDirtyFlag=true;" aria-required="true" i_required="true" bgtparse="true" maxlength="128" autocomplete="street-address">''',
        "label": "street"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" class="dropdown-search" autocomplete="off" placeholder="— Type to Search —" title="— Type to Search —" aria-label="— Type to Search —" role="combobox" aria-autocomplete="list" aria-controls="-1_PersonProfileFields.AddressCountry_dropdown-results" aria-expanded="false" style="width: 198px;">''',
        "label": "country"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" class="dropdown-search" autocomplete="off" placeholder="— Type to Search —" title="— Type to Search —" aria-label="— Type to Search —" role="combobox" aria-autocomplete="list" aria-controls="-1_PersonProfileFields.AddressState_dropdown-results" aria-expanded="true" style="width: 198px;">''',
        "label": "state"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" id="-1_PersonProfileFields.AddressCity" name="-1_PersonProfileFields.AddressCity" class="iCIMS_Forms_Global customFieldContainer iCIMS_Forms_TextField iCIMS_Forms_Qnull iCIMS_Forms_RequiredField form-control" onchange="pageDirtyFlag=true;" aria-required="true" i_required="true" bgtparse="true" maxlength="64" autocomplete="address-level2">''',
        "label": "city"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" id="-1_PersonProfileFields.AddressZip" name="-1_PersonProfileFields.AddressZip" class="iCIMS_Forms_Global customFieldContainer iCIMS_Forms_TextField iCIMS_Forms_Qnull iCIMS_Forms_RequiredField form-control" onchange="pageDirtyFlag=true;" aria-required="true" i_required="true" bgtparse="true" maxlength="16" autocomplete="postal-code">''',
        "label": "postalCode"
    },
    {
        "source": "Greenhouse",
        "html": '''<select id="-1_PersonProfileFields.PhoneType" name="-1_PersonProfileFields.PhoneType" data-label="Type" class=" iCIMS_Forms_Global customFieldContainer iCIMS_Forms_ListEditorField iCIMS_Forms_Qnull iCIMS_Forms_RequiredField form-control" aria-label="Type" bgtparse="true" list="lists.phone_type" type="3025" onchange="pageDirtyFlag=true;if (this.options[this.selectedIndex].value == -1) { return addItemToSelectFieldNLevelList(this); }else{ this.prevIndex = this.selectedIndex; } " aria-required="true" i_required="true" icimsdropdown-enabled="0" icimsdropdown-ajax="1" icimsdropdown-search="0" icimsdropdown-selected="" hash="21e2b16a92363ef2f1851db94166ef7b5d87ddcbfa59a2912e7ef86393170316"><option value="" legacy="true"></option><option title="Mobile" value="15145">Mobile</option><option title="Home" value="15143">Home</option></select>''',
        "label": "deviceType"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" id="-1_PersonProfileFields.PhoneNumber" name="-1_PersonProfileFields.PhoneNumber" class="iCIMS_Forms_Global customFieldContainer iCIMS_Forms_TextField iCIMS_Forms_Qnull iCIMS_Forms_RequiredField form-control" onchange="pageDirtyFlag=true;" aria-required="true" i_required="true" bgtparse="true" maxlength="128" autocomplete="tel-national">''',
        "label": "phone"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" class="dropdown-search" autocomplete="off" placeholder="— Type to Search —" title="— Type to Search —" aria-label="— Type to Search —" role="combobox" aria-autocomplete="list" aria-controls="-1_CandProfileFields.School_dropdown-results" aria-expanded="true" aria-activedescendant="result-selectable_-1_CandProfileFields.School_0" style="width: 198px;">''',
        "label": "school"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" class="dropdown-search" autocomplete="off" placeholder="— Type to Search —" title="— Type to Search —" aria-label="— Type to Search —" role="combobox" aria-autocomplete="list" aria-controls="-1_CandProfileFields.Degree_dropdown-results" aria-expanded="true" style="width: 198px;">''',
        "label": "degree"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" class="dropdown-search" autocomplete="off" placeholder="— Type to Search —" title="— Type to Search —" aria-label="— Type to Search —" role="combobox" aria-autocomplete="list" aria-controls="-1_CandProfileFields.Major_dropdown-results" aria-expanded="true" style="width: 198px;">''',
        "label": "field"
    },
    {
        "source": "Greenhouse",
        "html": '''<select id="-1_CandProfileFields.IsGraduated" name="-1_CandProfileFields.IsGraduated" data-label="Did You Graduate?" class=" iCIMS_Forms_Global customFieldContainer iCIMS_Forms_ListEditorField iCIMS_Forms_Qnull form-control" aria-label="Did You Graduate?" bgtparse="true" list="lists.customfields_lists" type="3081" onchange="pageDirtyFlag=true;if (this.options[this.selectedIndex].value == -1) { return addItemToSelectFieldNLevelList(this); }else{ this.prevIndex = this.selectedIndex; } " icimsdropdown-enabled="0" icimsdropdown-ajax="1" icimsdropdown-search="0" icimsdropdown-selected="" hash="91b5c419a4809ad8f0c9a2e8fb2651a9e97bdc64a9239c145b7ed2beb5e30dc2"><option value="" legacy="true"></option><option title="Yes" value="20466">Yes</option><option title="No" value="20467">No</option></select>''',
        "label": "graduated"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" size="3" id="-1_CandProfileFields.GPA" name="-1_CandProfileFields.GPA" class="iCIMS_Forms_Global customFieldContainer iCIMS_Forms_DecimalField iCIMS_Forms_Qnull form-control" onchange="pageDirtyFlag=true; ">''',
        "label": "gpa"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" class="dropdown-search" autocomplete="off" placeholder="— Type to Search —" title="— Type to Search —" aria-label="— Type to Search —" role="combobox" aria-autocomplete="list" aria-controls="-1_CandProfileFields.EducationCountry_dropdown-results" aria-expanded="true" style="width: 198px;">''',
        "label": "educationCountry"
    },
    {
        "source": "Greenhouse",
        "html": '''<input type="text" class="dropdown-search" autocomplete="off" placeholder="— Type to Search —" title="— Type to Search —" aria-label="— Type to Search —" role="combobox" aria-autocomplete="list" aria-controls="-1_CandProfileFields.EducationState_dropdown-results" aria-expanded="true" style="width: 198px;">''',
        "label": "educationState"
    }
]

def extract_input_attributes(html_string, label):
    soup = BeautifulSoup(html_string, "html.parser")
    input_tag = soup.find("input")
    if not input_tag:
        return None

    attributes = dict(input_tag.attrs)

    # Convert class list to string if present
    if "class" in attributes:
        attributes["class"] = " ".join(attributes["class"])

    # Structure the data as per your desired format
    return {
        "tag": input_tag.name,
        "attributes": attributes,
        "label": label
    }

# Build dataset
dataset = [extract_input_attributes(entry["html"], entry["label"]) 
           for entry in html_examples 
           if extract_input_attributes(entry["html"], entry["label"]) is not None]

# Save to JSON file
with open("manual_form_fields.json", "w") as f:
    json.dump(dataset, f, indent=2)

print("Saved dataset with", len(dataset), "entries.")