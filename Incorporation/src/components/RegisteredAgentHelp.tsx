import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  state: string;
};

export default function RegisteredAgentHelp({ isOpen, onClose, state }: Props) {
  if (!isOpen) return null;

  const isDelaware = state === "DE";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl border border-gray-200 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Registered Agent Service</h3>
            <p className="text-sm text-gray-600 mt-1">Do you need professional registered agent service?</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{maxHeight: 'calc(80vh - 120px)'}}>
          {isDelaware ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600">ℹ</span>
                  <span className="font-medium text-blue-800">Delaware Requirement</span>
                </div>
                <p className="text-sm text-blue-700">
                  Delaware <strong>requires</strong> all LLCs and corporations to have a registered agent with a Delaware address.
                  You cannot use a P.O. Box or out-of-state address.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-600">✓</span>
                    <span className="font-medium text-green-700">Professional Service ($149/year)</span>
                  </div>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Delaware address provided</li>
                    <li>• Legal documents received securely</li>
                    <li>• Email/mail forwarding</li>
                    <li>• Privacy protection (your address not public)</li>
                    <li>• Professional appearance</li>
                    <li>• No missed documents</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-600">⚠</span>
                    <span className="font-medium text-orange-700">Provide Your Own Agent</span>
                  </div>
                  <ul className="space-y-1 text-sm text-orange-700">
                    <li>• Must have Delaware street address</li>
                    <li>• Available during business hours</li>
                    <li>• Their address becomes public record</li>
                    <li>• Risk of missed legal documents</li>
                    <li>• You'll need to provide name & address</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600">ℹ</span>
                  <span className="font-medium text-blue-800">Registered Agent Options</span>
                </div>
                <p className="text-sm text-blue-700">
                  Most states allow you to serve as your own registered agent if you have an address in the state,
                  but professional service offers significant advantages.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-600">✓</span>
                    <span className="font-medium text-green-700">Professional Service ($149/year)</span>
                  </div>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Privacy protection</li>
                    <li>• Professional business address</li>
                    <li>• Reliable document handling</li>
                    <li>• Email notifications</li>
                    <li>• No personal address in public records</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-600">⚠</span>
                    <span className="font-medium text-orange-700">Use Your Own Address</span>
                  </div>
                  <ul className="space-y-1 text-sm text-orange-700">
                    <li>• Must be available during business hours</li>
                    <li>• Your address becomes public record</li>
                    <li>• Risk of missing important legal documents</li>
                    <li>• Must update if you move</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}