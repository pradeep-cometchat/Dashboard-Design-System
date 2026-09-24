import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import '../src/assets/fonts/satoshi.css'
import '../src/foundations/tokens.css'

const preview: Preview = {
  parameters: {
    // Show a "Code" tab (view + copy source) in the addons panel on every story,
    // not just in the Docs page.
    docs: { codePanel: true },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    options: {
      storySort: {
        order: [
          'Foundations',
          ['Overview', 'Colors (May 2026)', ['Overview', 'Primitive Ramps', 'Semantic Colors', 'Changes vs Current', 'Open Questions'], 'Typography (May 2026)', ['Overview', 'Type Styles', 'Changes vs Current'], 'Spacing & Radius (May 2026)', ['Overview', 'Scales', 'Changes vs Current'], 'Icons (May 2026)', ['Overview', 'Icon Library'], 'Misc Icons (May 2026)', ['Overview', 'Icon Library'], 'Elevation & Effects'],
          'Base Components',
          'Screens',
          ['Conversation Explorer', ['Overview', '1:1 Chat', 'Group Chat'], 'Pin', ['Overview', 'Settings'], 'Audit Logs', ['Main']],
        ],
      },
    },
  },

  decorators: [
    // Base components use react-router <Link> and expect a router context.
    // Stories that render a full-height (100vh) dashboard frame opt out of the canvas
    // padding with `parameters: { fullBleed: true }` — otherwise a 24px white band
    // surrounds the frame and its bottom is pushed off-screen. Everything else keeps it.
    (Story, context) => (
      <MemoryRouter>
        <div style={{ padding: context.parameters.fullBleed ? 0 : 24, fontFamily: "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default preview;
