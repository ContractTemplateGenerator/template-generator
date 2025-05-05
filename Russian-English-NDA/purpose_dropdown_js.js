// Function to toggle custom purpose textarea visibility
function toggleCustomPurpose() {
    const purposeSelect = document.getElementById('purpose');
    const purposeSelectRu = document.getElementById('purpose-ru');
    const customPurposeGroup = document.getElementById('custom-purpose-group');
    
    if ((currentLanguage === 'english' && purposeSelect.value === 'other') || 
        (currentLanguage === 'russian' && purposeSelectRu.value === 'other')) {
        customPurposeGroup.style.display = 'block';
    } else {
        customPurposeGroup.style.display = 'none';
    }
}

// Special sync function for purpose fields
function syncPurposeValues() {
    const purposeSelect = document.getElementById('purpose');
    const purposeSelectRu = document.getElementById('purpose-ru');
    const customPurpose = document.getElementById('custom-purpose');
    const customPurposeRu = document.getElementById('custom-purpose-ru');
    
    // Map English options to Russian options and vice versa
    const enToRuMap = {
        'evaluating a potential business partnership': 'оценка возможного делового партнерства',
        'exploring a potential joint venture': 'изучение возможности создания совместного предприятия',
        'discussing a potential investment opportunity': 'обсуждение потенциальной инвестиционной возможности',
        'evaluating a potential merger or acquisition': 'оценка возможного слияния или поглощения',
        'discussing potential software development collaboration': 'обсуждение возможного сотрудничества по разработке программного обеспечения',
        'exploring potential consulting services': 'изучение возможности консультационных услуг',
        'other': 'other'
    };
    
    const ruToEnMap = {
        'оценка возможного делового партнерства': 'evaluating a potential business partnership',
        'изучение возможности создания совместного предприятия': 'exploring a potential joint venture',
        'обсуждение потенциальной инвестиционной возможности': 'discussing a potential investment opportunity',
        'оценка возможного слияния или поглощения': 'evaluating a potential merger or acquisition',
        'обсуждение возможного сотрудничества по разработке программного обеспечения': 'discussing potential software development collaboration',
        'изучение возможности консультационных услуг': 'exploring potential consulting services',
        'other': 'other'
    };
    
    // When English dropdown changes
    purposeSelect.addEventListener('change', function() {
        const correspondingRuValue = enToRuMap[this.value] || 'other';
        purposeSelectRu.value = correspondingRuValue;
        toggleCustomPurpose();
        highlightChanges('purpose');
    });
    
    // When Russian dropdown changes
    purposeSelectRu.addEventListener('change', function() {
        const correspondingEnValue = ruToEnMap[this.value] || 'other';
        purposeSelect.value = correspondingEnValue;
        toggleCustomPurpose();
        highlightChanges('purpose-ru');
    });
    
    // Sync custom purpose textareas
    customPurpose.addEventListener('input', function() {
        const translated = translateText(this.value, 'en', 'ru');
        customPurposeRu.value = translated;
        highlightChanges('custom-purpose');
    });
    
    customPurposeRu.addEventListener('input', function() {
        const translated = translateText(this.value, 'ru', 'en');
        customPurpose.value = translated;
        highlightChanges('custom-purpose-ru');
    });
}
