import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import IncorporationIntake from './IncorporationIntake';

describe('IncorporationIntake', () => {
  it('renders default Delaware LLC with registered agent pre-selected', () => {
    render(<IncorporationIntake variant="default" />);
    expect(screen.getByDisplayValue('Delaware (recommended)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('LLC')).toBeInTheDocument();
    const raButton = screen.getByRole('button', { name: /Registered Agent \(first year\)/i });
    expect(raButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches packages and updates summary', async () => {
    const user = userEvent.setup();
    render(<IncorporationIntake variant="default" />);
    await act(async () => {
      await user.click(screen.getByLabelText('Professional Package'));
    });
    expect((await screen.findAllByText('Professional Package')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText(/EIN assistance/)).length).toBeGreaterThan(0);
  });

  it('indicates when ownership total reaches one hundred percent', () => {
    render(<IncorporationIntake variant="default" />);
    expect(screen.getByText(/Looks good for 100% allocation/)).toBeInTheDocument();
  });

  it('computes an ETA in business days', () => {
    render(<IncorporationIntake variant="default" />);
    const etaBanner = screen.getByText(/Your incorporation will be complete by/i);
    expect(etaBanner.textContent).toMatch(/Your incorporation will be complete by/);
  });

  it('disables expedited options when the selected state does not offer them', async () => {
    const user = userEvent.setup();
    render(<IncorporationIntake variant="default" />);

    await act(async () => {
      await user.selectOptions(screen.getByLabelText(/State of incorporation/i), ['AL']);
    });

    const expedited = screen.getByRole('radio', { name: 'Expedited' });
    const rush = screen.getByRole('radio', { name: 'Rush' });

    expect(expedited).toBeDisabled();
    expect(rush).toBeDisabled();
    expect(screen.getAllByText(/Not available in AL/).length).toBeGreaterThan(0);
  });
});
