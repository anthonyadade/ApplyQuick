def preprocess_input(field):
    attrs = field.attributes
    return ' '.join(attrs.values())
    return f"{attrs.get('name', '')} {attrs.get('id', '')} {attrs.get('placeholder', '')} {attrs.get('aria-label', '')} {field.label}"
