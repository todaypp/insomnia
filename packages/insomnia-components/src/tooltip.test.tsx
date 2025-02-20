import { jest } from '@jest/globals';
import { ByRoleMatcher, ByRoleOptions, fireEvent, render } from '@testing-library/react';
import React from 'react';

import { Tooltip } from './tooltip';

type QueryByRole = (
  text: ByRoleMatcher,
  options?: ByRoleOptions | undefined,
) => HTMLElement | null;

const expectNoTooltip = (queryByRole: QueryByRole) => {
  expect(queryByRole('tooltip', { hidden: true })).toBeNull();
  expect(queryByRole('tooltip', {})).toBeNull();
};

describe('<Tooltip />', () => {
  it('should show and hide the tooltip correctly', async () => {
    const childText = 'some child';
    const delay = 200;
    const message = 'message';

    const { getByRole, getByText, queryByRole, unmount } = render(
      <Tooltip message={message} delay={delay}>
        {childText}
      </Tooltip>,
    );

    expect(getByRole('tooltip', { hidden: true })).toBeTruthy();

    fireEvent.mouseEnter(getByText(childText));

    // Should open after the configured delay, wait a sufficient amount
    jest.advanceTimersByTime(delay * 2);

    expect(getByRole('tooltip')).toBeTruthy();

    fireEvent.mouseLeave(getByText(childText));

    // Should close after 100ms default, wait a sufficient amount
    jest.advanceTimersByTime(delay);

    expect(getByRole('tooltip', { hidden: true })).toBeTruthy();

    unmount();

    expectNoTooltip(queryByRole);
  });

  it('should not render tooltip if no message exists', () => {
    const childText = 'some child';
    const message = '';
    const { queryByRole, getByText } = render(<Tooltip message={message}>{childText}</Tooltip>);

    expectNoTooltip(queryByRole);
    expect(getByText(childText)).toBeTruthy();
  });

  it('should unmount successfully if message is empty in the first render then and non-empty after update', async () => {
    const childText = 'some child';
    const initialMessage = '';
    const newMessage = 'message';

    const { queryByRole, getByRole, getByText, queryByText, rerender, unmount } = render(
      <Tooltip message={initialMessage}>{childText}</Tooltip>,
    );

    expectNoTooltip(queryByRole);
    expect(getByText(childText)).toBeTruthy();

    rerender(<Tooltip message={newMessage}>{childText}</Tooltip>);

    expect(getByRole('tooltip', { hidden: true })).toBeTruthy();
    expect(getByText(childText)).toBeTruthy();

    unmount();

    expectNoTooltip(queryByRole);
    expect(queryByText(childText)).toBeFalsy();
  });
});
