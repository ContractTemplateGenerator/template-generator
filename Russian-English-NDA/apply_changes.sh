#!/bin/bash

# Set the file path
INDEX_FILE="/Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/Russian-English-NDA/index.html"

# Create a backup of the original file
cp "$INDEX_FILE" "${INDEX_FILE}.bak"

# 1. Replace the Purpose of Disclosure textarea with dropdown
awk -v RS='<div class="form-group">' -v ORS='<div class="form-group">' '
  /Purpose of Disclosure/ {
    # Read the replacement HTML
    getline replacement < "/Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/Russian-English-NDA/purpose_dropdown.html"
    print replacement
    next
  }
  { print }
' "${INDEX_FILE}.bak" > "${INDEX_FILE}.tmp1"

# 2. Insert the toggleCustomPurpose and syncPurposeValues functions
# Find a good insertion point in the script section
awk -v RS='<script>' -v ORS='<script>' '
  NR==2 {
    print $0
    # Read the JavaScript functions
    getline js_functions < "/Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/Russian-English-NDA/purpose_dropdown_js.js"
    print js_functions
    next
  }
  { print }
' "${INDEX_FILE}.tmp1" > "${INDEX_FILE}.tmp2"

# 3. Update the generateDocument function
# Find purpose assignment in generateDocument
awk '
  /purpose = document.getElementById.*Purpose of Disclosure/ {
    # Read the replacement code
    getline replacement < "/Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/Russian-English-NDA/purpose_generate_document.js"
    print replacement
    # Skip the next 7 lines (the existing purpose assignment)
    for(i=0; i<7; i++) getline
    next
  }
  { print }
' "${INDEX_FILE}.tmp2" > "${INDEX_FILE}.tmp3"

# 4. Update the highlightChanges function
# Find a good position in the function to add the purpose handling
awk '
  /else if.*elementId.*custom-conf-info/ {
    print
    # Read the highlight code
    getline highlight_code < "/Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/Russian-English-NDA/purpose_highlight_changes.js"
    print highlight_code
    next
  }
  { print }
' "${INDEX_FILE}.tmp3" > "${INDEX_FILE}.tmp4"

# 5. Update the initialization function
# Find initializeApp function and add our changes
awk '
  /function initializeApp/ {
    print
    # Read the initialization code
    getline init_code < "/Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/Russian-English-NDA/purpose_initialization.js"
    print init_code
    next
  }
  { print }
' "${INDEX_FILE}.tmp4" > "${INDEX_FILE}"

# Clean up temporary files
rm "${INDEX_FILE}.tmp1" "${INDEX_FILE}.tmp2" "${INDEX_FILE}.tmp3" "${INDEX_FILE}.tmp4"

echo "Changes applied successfully. A backup of the original file is at ${INDEX_FILE}.bak"
