import { useState } from 'react';

type Props = {
  state: string;
  entity: string;
};

export default function LLCManagementExplanation({ state, entity }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (entity !== 'LLC') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-blue-200 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-semibold text-blue-900 hover:text-blue-700"
      >
        <span className="flex items-center gap-2">
          🏢 LLC Management Structure
        </span>
        <span className="text-xs text-blue-600">
          {isExpanded ? 'Hide' : 'Show'} Details
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-4 text-sm">
          <p className="text-gray-700">
            LLCs can be structured with two main management approaches. Choose the one that best fits your business needs:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Member-Managed */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Member-Managed LLC</h4>

              <div className="space-y-2 text-xs text-green-800">
                <div>
                  <strong>Who makes decisions:</strong> All members (owners) have equal say in daily operations and major decisions
                </div>

                <div>
                  <strong>Best for:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Small businesses with few owners</li>
                    <li>All owners want to be involved in operations</li>
                    <li>Simple decision-making structure preferred</li>
                    <li>Professional service businesses</li>
                  </ul>
                </div>

                <div>
                  <strong>Key features:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>All members can bind the LLC in contracts</li>
                    <li>Members share management duties</li>
                    <li>More democratic decision-making</li>
                    <li>Default structure in most states</li>
                  </ul>
                </div>

                <div>
                  <strong>Example:</strong> A law firm where all partners want equal say in client matters and business decisions.
                </div>
              </div>
            </div>

            {/* Manager-Managed */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Manager-Managed LLC</h4>

              <div className="space-y-2 text-xs text-blue-800">
                <div>
                  <strong>Who makes decisions:</strong> Designated managers (who may or may not be members) handle daily operations
                </div>

                <div>
                  <strong>Best for:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Passive investors who don't want daily involvement</li>
                    <li>Complex businesses needing professional management</li>
                    <li>Multiple owners with different roles</li>
                    <li>When seeking outside investment</li>
                  </ul>
                </div>

                <div>
                  <strong>Key features:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Only managers can bind the LLC</li>
                    <li>Clear separation of ownership and management</li>
                    <li>More attractive to passive investors</li>
                    <li>Can hire professional managers</li>
                  </ul>
                </div>

                <div>
                  <strong>Example:</strong> A real estate investment LLC where some members provide capital but don't want operational responsibilities.
                </div>
              </div>
            </div>
          </div>

          {/* State-Specific Notes */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">
              📍 {state} Specific Requirements
            </h4>
            <div className="text-xs text-yellow-800 space-y-1">
              {state === 'DE' && (
                <>
                  <p>• Delaware requires you to specify management structure in your Certificate of Formation</p>
                  <p>• Default is member-managed unless you elect manager-managed</p>
                  <p>• Manager-managed LLCs must maintain a list of managers</p>
                </>
              )}
              {state === 'CA' && (
                <>
                  <p>• California requires management structure in Articles of Organization</p>
                  <p>• Manager information must be provided to the Secretary of State</p>
                  <p>• Statement of Information must list current managers</p>
                </>
              )}
              {state === 'NY' && (
                <>
                  <p>• New York requires management structure in Articles of Organization</p>
                  <p>• Must specify if LLC will be managed by members or managers</p>
                  <p>• Publication requirement applies regardless of management structure</p>
                </>
              )}
              {state === 'TX' && (
                <>
                  <p>• Texas requires management structure in Certificate of Formation</p>
                  <p>• Must name initial managers if manager-managed</p>
                  <p>• Registered agent can be a manager</p>
                </>
              )}
              {state === 'FL' && (
                <>
                  <p>• Florida requires management structure in Articles of Organization</p>
                  <p>• Annual reports must identify current managers</p>
                  <p>• Manager information is public record</p>
                </>
              )}
              {!['DE', 'CA', 'NY', 'TX', 'FL'].includes(state) && (
                <>
                  <p>• Most states require you to specify management structure in formation documents</p>
                  <p>• Check with your state's filing requirements for specific details</p>
                  <p>• Annual reports typically require current management information</p>
                </>
              )}
            </div>
          </div>

          {/* Decision Factors */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🤔 How to Choose</h4>
            <div className="text-xs text-gray-700 space-y-2">
              <div>
                <strong>Choose Member-Managed if:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>You have 2-3 active owners who all want to participate</li>
                  <li>Your business is relatively simple</li>
                  <li>All members have relevant business experience</li>
                  <li>You want maximum flexibility and democratic control</li>
                </ul>
              </div>
              <div>
                <strong>Choose Manager-Managed if:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>You have passive investors or silent partners</li>
                  <li>Your business needs professional management</li>
                  <li>You want to bring in outside managers</li>
                  <li>You're planning to seek additional investment</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 italic">
            Note: You can typically change your management structure later by amending your operating agreement and, in some states, filing an amendment with the state.
          </div>
        </div>
      )}
    </div>
  );
}