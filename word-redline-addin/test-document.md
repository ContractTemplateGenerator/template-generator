# Test Document for Redline Processor

This is a sample document you can use to test the Word Redline Processor add-in.

## Sample Contract Text

**CONSULTING AGREEMENT**

This Consulting Agreement ("Agreement") is entered into on [Date] between Company, a Delaware corporation ("Company"), and Consultant, an individual ("Consultant").

**1. Services**
Consultant shall provide consulting services as described in Exhibit A. The services shall be completed within 60 days of the effective date.

**2. Compensation** 
Company shall pay Consultant a fee of $5,000 for the services. Payment shall be made within 30 days of completion.

**3. Term**
This Agreement shall commence on the effective date and continue until completion of the services, unless terminated earlier according to the terms herein.

**4. Confidentiality**
Consultant acknowledges that they may have access to confidential information and agrees to maintain strict confidentiality.

**5. Governing Law**
This Agreement shall be governed by the laws of the State of Delaware.

---

## Test Redline Instructions

Copy and paste these instructions into the Redline Processor add-in to test functionality:

```
Change "Company" to "Client"
Change "Consultant" to "Contractor" 
Delete "a Delaware corporation"
Change "60 days" to "90 days"
Change "30 days" to "45 days"
Replace "$5,000" with "$7,500"
Add "This agreement includes a liquidated damages provision." at the end
Delete "strict confidentiality"
Change "Delaware" to "California"
```

## Expected Results

After processing, you should see track changes showing:
- "Company" → "Client" (multiple replacements)
- "Consultant" → "Contractor" (multiple replacements)  
- Deletion of "a Delaware corporation"
- "60 days" → "90 days"
- "30 days" → "45 days"
- "$5,000" → "$7,500"
- Addition of liquidated damages text
- Deletion of "strict confidentiality"  
- "Delaware" → "California"

All changes should appear as proper Word track changes that can be accepted or rejected individually.

## Testing Checklist

- [ ] Add-in loads successfully in Word
- [ ] Task pane opens when clicking ribbon button
- [ ] "Enable Track Changes" button works
- [ ] Can paste redline instructions
- [ ] Processing button executes without errors
- [ ] Changes appear as native Word track changes
- [ ] Results log shows processed instructions
- [ ] Track changes can be accepted/rejected normally
- [ ] Multiple instruction types work (change, delete, add, replace)