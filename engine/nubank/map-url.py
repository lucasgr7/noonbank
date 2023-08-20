import requests
import json
import sys

def fetch_data(url: str, api_key: str) -> dict:
    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def generate_typescript_type(value: any, name: str) -> str:
    if isinstance(value, dict):
        return generate_typescript_interface(value, name)
    elif isinstance(value, list):
        if value:
            return generate_typescript_type(value[0], name) + "[]"
        else:
            return "any[]"
    elif isinstance(value, str):
        return "string"
    elif isinstance(value, int):
        return "number"
    elif isinstance(value, bool):
        return "boolean"
    else:
        return "any"

def generate_typescript_interface(data: dict, name: str) -> str:
    ts_code = f"interface {name} {{\n"
    for key, value in data.items():
        ts_type = generate_typescript_type(value, key.capitalize())
        ts_code += f"  {key}: {ts_type};\n"
    ts_code += "}"
    return ts_code

def main():
    if len(sys.argv) != 3:
        print("Usage: python script.py <url> <api_key>")
        return

    url = sys.argv[1]
    api_key = sys.argv[2]
    data = fetch_data(url, api_key)
    ts_code = generate_typescript_interface(data, "APIResponse")
    with open("api-types.ts", "w") as file:
        file.write(ts_code)
    print("TypeScript interfaces generated successfully.")

if __name__ == "__main__":
    main()
