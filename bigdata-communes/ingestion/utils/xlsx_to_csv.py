import os
import pandas as pd
import argparse

def convert_xlsx_files(input_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)

    for root, _, files in os.walk(input_dir):
        for filename in files:
            if filename.endswith(".xlsx") or filename.endswith(".xls") and not filename.startswith("~$"):
                xlsx_path = os.path.join(root, filename)
                relative_root = os.path.relpath(root, input_dir)
                base_name = os.path.splitext(filename)[0]

                try:
                    sheets = pd.read_excel(xlsx_path, sheet_name=None)
                    for sheet_name, df in sheets.items():
                        clean_sheet_name = sheet_name.replace(" ", "_").replace("/", "_")
                        relative_output_dir = os.path.join(output_dir, relative_root)
                        os.makedirs(relative_output_dir, exist_ok=True)

                        output_filename = f"{base_name}__{clean_sheet_name}.csv"
                        output_path = os.path.join(relative_output_dir, output_filename)
                        df.to_csv(output_path, index=False)
                        print(f"[✓] Converted {xlsx_path} ({sheet_name}) → {output_path}")
                except Exception as e:
                    print(f"[!] Failed to convert {xlsx_path}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Convert XLSX files to CSV")
    parser.add_argument("--input-dir", required=True, help="Directory containing XLSX files")
    parser.add_argument("--output-dir", required=True, help="Output directory for CSV files")
    args = parser.parse_args()

    convert_xlsx_files(args.input_dir, args.output_dir)

if __name__ == "__main__":
    main()
