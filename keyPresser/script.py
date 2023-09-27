import tkinter as tk
from tkinter import ttk, simpledialog
import threading
import pyautogui
import time
import json

# To keep track of the checkboxes
checkbox_states = {}

# Load saved key combinations from file
def load_combinations():
    try:
        with open('combinations.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

# Save key combinations to file
def save_combinations(combinations):
    with open('combinations.json', 'w') as f:
        json.dump(combinations, f)

def press_keys(keys_str):
    print("Started pressing keys")  # Debug message
    initial_delay = 5  # Delay of 5 seconds before starting
    time.sleep(initial_delay)
    
    keys_list = keys_str.split()
    delay = 0.4
    for key in keys_list:
        print(f"Pressing {key}")  # Debug message
        pyautogui.press(key)
        time.sleep(delay)

def press_keys_with_delay():
    for name, var in checkbox_states.items():
        if var.get():
            start_thread(key_combinations[name])
            time.sleep(7)

def start_thread(keys_str):
    thread = threading.Thread(target=press_keys, args=(keys_str,))
    thread.start()

def check_all_boxes():
    if any(var.get() for var in checkbox_states.values()):
        print_all_button.config(state='normal')
    else:
        print_all_button.config(state='disabled')

def add_new_command():
    new_window = tk.Toplevel(root)
    new_window.title("New Command")
    
    label_name = ttk.Label(new_window, text="Command Name:")
    entry_name = ttk.Entry(new_window, width=20)
    label_keys = ttk.Label(new_window, text="Keys:")
    entry_keys = ttk.Entry(new_window, width=30)
    
    def save_command():
        name = entry_name.get()
        keys = entry_keys.get()
        key_combinations[name] = keys
        save_combinations(key_combinations)
        add_button_to_main_window(name, keys)
        new_window.destroy()

    save_button = ttk.Button(new_window, text="Save", command=save_command)
    
    label_name.grid(row=0, column=0, padx=10, pady=5)
    entry_name.grid(row=0, column=1, padx=10, pady=5)
    label_keys.grid(row=1, column=0, padx=10, pady=5)
    entry_keys.grid(row=1, column=1, padx=10, pady=5)
    save_button.grid(row=2, columnspan=2, pady=10)

def add_button_to_main_window(name, keys):
    var = tk.IntVar()
    checkbox = tk.Checkbutton(root, text="", variable=var, command=check_all_boxes)
    button = ttk.Button(root, text=name, command=lambda: start_thread(keys))

    row_num = len(checkbox_states)
    checkbox.grid(row=row_num, column=0, sticky='W')
    button.grid(row=row_num, column=1, sticky='W')

    checkbox_states[name] = var

# Main program
key_combinations = load_combinations()

root = tk.Tk()
root.title("Printer")

for name, keys in key_combinations.items():
    add_button_to_main_window(name, keys)

new_command_button = ttk.Button(root, text="New Command", command=add_new_command)
new_command_button.grid(row=len(checkbox_states) + 1, columnspan=2, pady=10, sticky='W')

print_all_button = ttk.Button(root, text="Print All", state='disabled', command=lambda: threading.Thread(target=press_keys_with_delay).start())
print_all_button.grid(row=len(checkbox_states) + 2, columnspan=2, pady=10, sticky='W')

root.mainloop()
