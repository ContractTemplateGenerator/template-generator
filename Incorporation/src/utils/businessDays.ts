// Business day calculation utilities
export function addBusinessDays(startDate: Date, businessDays: number): Date {
  let currentDate = new Date(startDate);
  let remainingDays = businessDays;

  while (remainingDays > 0) {
    currentDate.setDate(currentDate.getDate() + 1);

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      remainingDays--;
    }
  }

  return currentDate;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export function isAfter10amPT(): boolean {
  const now = new Date();
  const ptTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
  return ptTime.getHours() >= 10;
}

export function getProcessingTimeline(speed: 'standard' | 'expedite' | 'rush') {
  const now = new Date();
  const isPastCutoff = isAfter10amPT();

  let startDate = new Date(now);
  let stateProcessingDays = 0;
  let description = '';

  switch (speed) {
    case 'standard':
      // I file in 3 business days, state processes in 1-2 weeks (7-10 business days)
      startDate = addBusinessDays(now, 3);
      stateProcessingDays = 10; // Use max estimate
      const standardCompletionDate = addBusinessDays(startDate, stateProcessingDays);
      description = `I file ${formatDate(startDate)}, state processes by ${formatDate(standardCompletionDate)}`;
      break;

    case 'expedite':
      // I file next business day, state processes in 2 business days
      startDate = addBusinessDays(now, 1);
      stateProcessingDays = 2;
      const expediteCompletionDate = addBusinessDays(startDate, stateProcessingDays);
      description = `I file ${formatDate(startDate)}, state processes by ${formatDate(expediteCompletionDate)}`;
      break;

    case 'rush':
      // I file same day (if before 10am PT), state processes next business day
      if (isPastCutoff) {
        startDate = addBusinessDays(now, 1);
        stateProcessingDays = 1;
        const rushCompletionDate = addBusinessDays(startDate, stateProcessingDays);
        description = `I file ${formatDate(startDate)}, state processes by ${formatDate(rushCompletionDate)}`;
      } else {
        startDate = new Date(now);
        stateProcessingDays = 1;
        const rushCompletionDate = addBusinessDays(startDate, stateProcessingDays);
        description = `I file ${formatDate(startDate)}, state processes by ${formatDate(rushCompletionDate)}`;
      }
      break;
  }

  const completionDate = addBusinessDays(startDate, stateProcessingDays);

  return {
    description,
    estimatedCompletion: `Expected completion: ${formatDate(completionDate)}`,
    timeline: `${formatDate(startDate)} - ${formatDate(completionDate)}`
  };
}