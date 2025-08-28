# 🖋️ File Read & Write Challenge + Error Handling Lab

def modify_file(input_file, output_file):
    """
    Reads content from input_file, modifies it, and writes to output_file.
    """
    try:
        with open(input_file, 'r') as f:
            lines = f.readlines()
        
        # Example modification: convert all text to uppercase
        modified_lines = [line.upper() for line in lines]

        with open(output_file, 'w') as f:
            f.writelines(modified_lines)
        
        print(f"Modified file written to '{output_file}' successfully!")

    except FileNotFoundError:
        print(f"Error: The file '{input_file}' does not exist.")
    except PermissionError:
        print(f"Error: You don't have permission to read/write '{input_file}' or '{output_file}'.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Ask user for input
input_file = input("Enter the input filename: ")
output_file = input("Enter the output filename: ")

modify_file(input_file, output_file)
