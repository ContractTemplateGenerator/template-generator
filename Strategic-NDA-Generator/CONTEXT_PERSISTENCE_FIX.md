# Chatbox Context Persistence Fix

## Problem
The chatbox was losing essential context (like term duration) on follow-up questions, causing responses like "the duration is not specified in the current context" even when the user had clearly set a duration in the form.

## Root Cause
The follow-up message logic was only sending changed fields to reduce token usage. If essential fields like `term` hadn't changed since the first message, they weren't included in subsequent API calls.

## Solution
Modified the chatbox component to always include essential context fields with every API request:

```javascript
// For follow-up messages, always include essential fields plus changes
formDataToSend = {
  // Always include essential context fields
  term: currentFormData.term,
  termUnit: currentFormData.termUnit,
  state: currentFormData.state,
  purpose: currentFormData.purpose,
  usePseudonyms: currentFormData.usePseudonyms,
  disclosingPartyName: currentFormData.disclosingPartyName,
  receivingPartyName: currentFormData.receivingPartyName,
  monetaryConsideration: currentFormData.monetaryConsideration,
  considerationAmount: currentFormData.considerationAmount,
  disputeResolution: currentFormData.disputeResolution,
  
  // Include changed fields
  ...changedFields,
  
  // Include which sections were affected by the changes
  affectedSections: Array.from(affectedSections).join(', ')
};
```

## Essential Fields That Must Always Be Sent
1. **term** & **termUnit**: Duration of the NDA
2. **state**: Governing law
3. **purpose**: Purpose of disclosure
4. **usePseudonyms**: Affects section numbering
5. **Party names**: For context in responses
6. **monetaryConsideration** & **considerationAmount**: For validity discussions
7. **disputeResolution**: For dispute-related questions

## Testing
To verify the fix works:
1. Set a term duration (e.g., 5 years)
2. Ask initial question about the NDA
3. Ask follow-up question about duration
4. Chatbox should correctly reference the 5-year term

## Future Improvements
Consider implementing a more sophisticated context management system that:
- Caches the full initial context
- Only sends deltas for large fields
- Maintains a context summary for all messages
- Implements smart field prioritization based on question type