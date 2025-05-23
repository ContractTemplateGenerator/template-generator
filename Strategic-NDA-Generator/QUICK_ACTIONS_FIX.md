# Fixed: Dynamic Section Numbers for Quick Actions

## Problem
The quick action questions were hardcoded with incorrect section numbers. They assumed pseudonyms were always being used, which shifts all section numbers up by 1.

## Solution
Made quick actions dynamic based on `formData.usePseudonyms`:

### Without Pseudonyms (Standard NDA):
- Section 1: Definition of Confidential Information
- Section 2: Exclusions  
- Section 3: Obligations
- Section 4: Permitted Disclosures
- Section 5: Term
- Section 6: Remedies
- Section 7: Dispute Resolution
- Section 8: Miscellaneous

### With Pseudonyms (Privacy NDA):
- Section 1: Identity of Parties
- Section 2: Definition of Confidential Information
- Section 3: Exclusions
- Section 4: Obligations  
- Section 5: Permitted Disclosures
- Section 6: Term
- Section 7: Remedies
- Section 8: Dispute Resolution
- Section 9: Miscellaneous
- Exhibit A: Side Letter

## Updated Quick Actions
The new quick actions are more conversational and address real concerns:

1. **"What exactly counts as confidential?"** - People want to know the scope
2. **"Is [X years] too long?"** - Duration concerns with actual term shown
3. **"Can I tell my lawyer/accountant?"** - Common exception people need
4. **"What happens if someone breaches?"** - Enforcement concerns
5. **"When can I destroy their info?"** - Practical obligations question

## Other Popular Questions to Consider:
- "Can I use their ideas if I develop them independently?"
- "What if I already knew this information?"
- "Do emails count as confidential information?"
- "Can they sue me personally or just my company?"
- "What if the government asks for the information?"
- "Is this mutual or one-way?"
- "Can I share with my co-founders/partners?"
- "What about information that becomes public?"
- "Do I need to mark things 'confidential'?"
- "Can this NDA be extended automatically?"

## Technical Implementation
```javascript
const getQuickActions = () => {
  const currentFormData = window.chatboxConfig?.formData || formData;
  const usePseudonyms = currentFormData.usePseudonyms || false;
  const offset = usePseudonyms ? 1 : 0;
  
  return [
    // Dynamic section numbers based on pseudonym usage
    `Question text (Section ${actualSection + offset} topic)`
  ];
};
```

The questions now:
- Show correct section numbers
- Include actual form values (like term duration)
- Focus on practical concerns users have
- Use conversational language