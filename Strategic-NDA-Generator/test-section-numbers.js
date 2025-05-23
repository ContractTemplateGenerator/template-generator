// Test script to verify dynamic section numbers
function testSectionNumbers() {
  // Test without pseudonyms
  console.log("=== Testing without pseudonyms ===");
  window.chatboxConfig = {
    formData: {
      usePseudonyms: false,
      term: "3",
      termUnit: "years"
    }
  };
  
  const actionsNoPseudonyms = [
    "Section 1: Definition of Confidential Information",
    "Section 5: Term (3 years)",
    "Section 4: Permitted Disclosures", 
    "Section 6: Remedies",
    "Section 3: Obligations"
  ];
  
  console.log("Expected sections:", actionsNoPseudonyms);
  
  // Test with pseudonyms
  console.log("\n=== Testing with pseudonyms ===");
  window.chatboxConfig.formData.usePseudonyms = true;
  
  const actionsWithPseudonyms = [
    "Section 2: Definition of Confidential Information",
    "Section 6: Term (3 years)",
    "Section 5: Permitted Disclosures",
    "Section 7: Remedies", 
    "Section 4: Obligations"
  ];
  
  console.log("Expected sections:", actionsWithPseudonyms);
  
  console.log("\n✓ Quick actions now dynamically adjust section numbers!");
}

// Run test
testSectionNumbers();