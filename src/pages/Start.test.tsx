import StartScreen from './Start';

import { describe, expect, it, test } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('StartScreen', () => {
  test('Start screen in changed to Home', () => {
    it('Check if Start button is in the doc', () => {
      const button = screen.getByRole('button');
      expect(button).toBeDefined();
    });
  });
});
