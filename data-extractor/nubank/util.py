import csv


def flatten_dict(d):
    flattened = {}
    for key, value in d.items():
        if isinstance(value, dict):
            for nested_key, nested_value in flatten_dict(value).items():
                flattened[f"{key}_{nested_key}"] = nested_value
        else:
            flattened[key] = value
    return flattened

def export_to_csv(data, filename='transactions.csv'):
    # Flatten the dictionaries
    flattened_data = [flatten_dict(row) for row in data]

    # Extract all the unique keys to use as headers
    headers = set()
    for row in flattened_data:
        headers.update(row.keys())

    # Write the flattened data to CSV
    with open(filename, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        writer.writeheader()
        for row in flattened_data:
            writer.writerow(row)

    print(f"{filename} has been created successfully.")