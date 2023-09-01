import argparse
import json


def create_table_script(table_name, columns):
    columns_str = ', '.join([
        f"{col} {typ}{' SERIAL PRIMARY KEY' if constraints.get('key') else ''}{' NULL' if constraints.get('nullable') else ''}"
        for col, (typ, constraints) in columns.items()
    ])
    return f"CREATE TABLE {table_name} ({columns_str});"

def create_ts_interface(table_name, columns):
    properties = ',\n'.join([
        f"  {col}: {map_sql_type_to_ts_type(typ)}{';' if not constraints.get('nullable') else '?;'}"
        for col, (typ, constraints) in columns.items()
    ])
    return f"export interface {table_name} {{\n{properties}\n}}"

def create_ts_columns_object(columns):
    return json.dumps({
        col: {
            "type": typ,
            "nullable": constraints.get('nullable', False)
        }
        for col, (typ, constraints) in columns.items()
    }, indent=2)

def map_sql_type_to_ts_type(sql_type):
    base_type = sql_type.split('(')[0].upper()
    mappings = {
        'SERIAL': 'number',
        'INTEGER': 'number',
        'VARCHAR': 'string',
        'TEXT': 'string',
        'DATE': 'Date',
        'TIMESTAMP': 'Date',
        'BOOLEAN': 'boolean',
        'FLOAT': 'number',
        'REAL': 'number',
    }
    return mappings.get(base_type, 'any')

def main():
    parser = argparse.ArgumentParser(description="Create PostgreSQL table script and TypeScript interface.")
    parser.add_argument("table_name", type=str, help="Table name")
    parser.add_argument("columns", type=str, nargs='+', help="Columns and types in 'column:type:constraints' format")

    args = parser.parse_args()

    if not args.table_name or not args.columns:
        print("Please provide both table name and columns in 'column:type:constraints' format.")
        print("Usage: python script.py table_name column1:type1:constraints column2:type2:constraints ...")
        return

    columns = {
        col.split(':')[0]: (
            col.split(':')[1],
            {
                'nullable': 'null' in col.split(':')[2:],
                'key': 'key' in col.split(':')[2:]
            }
        ) for col in args.columns
    }

    sql_script = create_table_script(args.table_name, columns)
    ts_interface = create_ts_interface(args.table_name, columns)
    ts_columns = create_ts_columns_object(columns)

    with open(f"{args.table_name}.sql", "w") as file:
        file.write(sql_script)

    with open(f"{args.table_name}.ts", "w") as file:
        file.write(ts_interface)
        file.write("\n\nconst columns = ")
        file.write(ts_columns)
        file.write(";")

    print(f"Table creation script and TypeScript interface for '{args.table_name}' saved.")

if __name__ == "__main__":
    main()
