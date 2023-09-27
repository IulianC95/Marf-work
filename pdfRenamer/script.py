import tkinter as tk
from tkinter import filedialog
import PyPDF2
import os

def read_text_between_keywords(file_path, page_number, start_keyword, end_keyword):
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        page = reader.pages[page_number]
        text = page.extract_text()

        start_pos = text.lower().find((start_keyword + " ").lower())
        end_pos = text.lower().find((end_keyword + " ").lower())

        if start_pos != -1 and end_pos != -1 and start_pos < end_pos:
            start = start_pos + len(start_keyword) + 1  # Adaugam 1 pentru spatiul adaugat
            end = end_pos
            found_text = text[start:end].strip()

            if found_text and not found_text.isspace():
                return found_text
        return None




def rename_file(file_path, new_name):
    directory = os.path.dirname(file_path)
    new_file_path = os.path.join(directory, f"{new_name}.pdf")
    os.rename(file_path, new_file_path)
    return new_file_path

def rename_pdfs():
    start_keyword = entry_start_keyword.get()
    end_keyword = entry_end_keyword.get()
    
    file_paths = filedialog.askopenfilenames(filetypes=[("PDF files", "*.pdf")])
    if not file_paths:
        return
    
    page_number = 0
    renamed_files = []
    
    for file_path in file_paths:
        text_between = read_text_between_keywords(file_path, page_number, start_keyword, end_keyword)
        if text_between:
            new_file_path = rename_file(file_path, text_between)
            renamed_files.append(new_file_path)
        else:
            renamed_files.append(f"Nu s-a găsit text între '{start_keyword}' și '{end_keyword}' în {file_path}")

    lbl_result.config(text="Fișiere redenumite:\n" + '\n'.join(renamed_files))

# GUI
window = tk.Tk()
window.title('Redenumire PDF-uri')

lbl_intro = tk.Label(window, text="Selectați unul sau mai multe fișiere PDF pentru a le redenumi.")
lbl_intro.pack()

lbl_start_keyword = tk.Label(window, text="Cuvânt de început:")
lbl_start_keyword.pack()
entry_start_keyword = tk.Entry(window)
entry_start_keyword.pack()

lbl_end_keyword = tk.Label(window, text="Cuvânt de sfârșit:")
lbl_end_keyword.pack()
entry_end_keyword = tk.Entry(window)
entry_end_keyword.pack()

btn_add_files = tk.Button(window, text="Adaugă fișiere", command=rename_pdfs)
btn_add_files.pack()

lbl_result = tk.Label(window, text="")
lbl_result.pack()

window.mainloop()
