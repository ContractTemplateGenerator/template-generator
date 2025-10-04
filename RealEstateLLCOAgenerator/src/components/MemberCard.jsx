import React from 'react';

const MemberCard = ({
  index,
  member,
  onChange,
  onRemove,
  disableRemove,
  onMemberFocus,
  autoFocus
}) => {
  const nameInputRef = React.useRef(null);

  React.useEffect(() => {
    if (autoFocus && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (field) => (event) => {
    onChange(member.id, field, event.target.value);
  };

  const handleFocus = (field) => () => {
    onMemberFocus(`member:${member.id}:${field}`);
  };

  return (
    <div className="member-card" data-member-card data-member-id={member.id}>
      <div className="member-card-header">
        <h3>
          Member <span data-member-index>{index + 1}</span>
        </h3>
        <button
          type="button"
          className="remove-member"
          data-remove-member
          onClick={() => onRemove(member.id)}
          disabled={disableRemove}
          aria-label={`Remove member ${index + 1}`}
        >
          Remove
        </button>
      </div>
      <label className="field">
        <span className="field-label">Member Name</span>
        <input
          ref={nameInputRef}
          type="text"
          data-member-input="name"
          data-field-key={`member:${member.id}:name`}
          value={member.name}
          onChange={handleInputChange('name')}
          onFocus={handleFocus('name')}
          placeholder="Member Name"
        />
      </label>
      <label className="field">
        <span className="field-label">Capital Contribution</span>
        <input
          type="text"
          data-member-input="contribution"
          data-field-key={`member:${member.id}:contribution`}
          value={member.contribution}
          onChange={handleInputChange('contribution')}
          onFocus={handleFocus('contribution')}
          placeholder="$50,000 cash"
        />
      </label>
      <label className="field">
        <span className="field-label">Ownership Percentage</span>
        <input
          type="text"
          data-member-input="percentage"
          data-field-key={`member:${member.id}:percentage`}
          value={member.percentage}
          onChange={handleInputChange('percentage')}
          onFocus={handleFocus('percentage')}
          placeholder="50%"
        />
      </label>
      <label className="field">
        <span className="field-label">Role / Responsibilities</span>
        <input
          type="text"
          data-member-input="role"
          data-field-key={`member:${member.id}:role`}
          value={member.role}
          onChange={handleInputChange('role')}
          onFocus={handleFocus('role')}
          placeholder="Handles acquisitions and financing"
        />
      </label>
    </div>
  );
};

export default MemberCard;
