# Strategic NDA Generator - Section Number Enhancements

## Overview
The Strategic NDA Generator chatbox has been enhanced with section number awareness to provide more specific and helpful responses. The AI assistant now references exact section numbers when discussing any NDA provisions.

## Changes Made

### 1. API Enhancements (`/api/nda-groq-chat.js`)

#### Section Reference Guide
Added a comprehensive section reference guide that adapts based on whether pseudonyms are used:

**With Pseudonyms:**
- Section 1: Identity of Parties (pseudonym declarations)
- Section 2: Definition of Confidential Information  
- Section 3: Exclusions from Confidential Information
- Section 4: Obligations of Receiving Party
- Section 5: Permitted Disclosures (Legal Carveouts)
- Section 6: Term
- Section 7: Remedies
- Section 8: Dispute Resolution
- Section 9: Miscellaneous
- Exhibit A: Identity Confirmation Letter (side letter)

**Without Pseudonyms:**
- Section 1: Definition of Confidential Information
- Section 2: Exclusions from Confidential Information
- Section 3: Obligations of Receiving Party
- Section 4: Permitted Disclosures (Legal Carveouts)
- Section 5: Term
- Section 6: Remedies
- Section 7: Dispute Resolution
- Section 8: Miscellaneous

#### Enhanced Context
- Added section references to form data context (e.g., "Duration affects Section 6: Term")
- Included field-to-section mapping for better context awareness
- Added examples of proper section referencing in responses

### 2. Chatbox Component Enhancements (`/components/chatbox-groq.js`)

#### Section-Aware Quick Actions
Updated quick action buttons to be section-specific:
- "What does Section 2 cover? (Confidential Information)"
- "How long does Section 6 make this last? (Term)"
- "What are my Section 4 obligations? (Receiving Party)"
- "When does Section 5 allow disclosure? (Legal Carveouts)"
- "What remedies are in Section 7? (Breach remedies)"

#### Section Change Tracking
Added logic to track which sections are affected when form fields change:
- Maps field changes to specific section numbers
- Sends affected sections list with API requests
- Helps AI provide more contextual responses about recent changes

#### Enhanced Form Data Context
Expanded the form data sent to the API to include:
- Section-specific configurations (confidentialInfoType, exclusions, obligations)
- Remedies configuration (injunctive relief, monetary damages, liquidated damages)
- Dispute resolution details

## Benefits

1. **Precise References**: Users get exact section numbers instead of vague references
2. **Better Context**: AI understands which sections are affected by form changes
3. **Improved Navigation**: Users can quickly find specific sections they're asking about
4. **Educational Value**: Users learn the NDA structure through consistent section references
5. **Professional Quality**: Responses feel more like they're from a competent lawyer

## Usage Examples

**Before Enhancement:**
"The confidentiality section defines what information is protected..."

**After Enhancement:**  
"Section 2 defines what constitutes Confidential Information in your NDA. Since you selected 'business' type information, Section 2 includes trade secrets, business plans, and customer information..."

## Technical Implementation

The enhancements maintain backward compatibility while adding:
- Dynamic section numbering based on pseudonym usage
- Automatic section mapping for all form fields
- Context-aware responses that reference specific sections
- Section tracking for form changes

## Future Improvements

1. Add section navigation links in responses
2. Create a section outline view in the chatbox
3. Add section-specific help tooltips
4. Implement cross-section dependency tracking
5. Create modular instructions for other generators