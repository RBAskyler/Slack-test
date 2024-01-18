const { App } = require('@slack/bolt');
const express = require('express');

const app = new App({
  token: 'YOUR_SLACK_APP_TOKEN',
  signingSecret: 'YOUR_SLACK_SIGNING_SECRET',
});

const port = 3000;
const expressApp = express();

expressApp.use('/slack/events', app.receiver.router);

expressApp.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.command('/dropdown', async ({ command, ack, say }) => {
  await ack();

  // Your dropdown options
  const options = [
    { text: 'Option 1', value: 'option1' },
    { text: 'Option 2', value: 'option2' },
    { text: 'Option 3', value: 'option3' },
  ];

  // Send a message with a dropdown
  await say({
    text: 'Select an option:',
    blocks: [
      {
        type: 'section',
        block_id: 'dropdown_section',
        text: {
          type: 'mrkdwn',
          text: 'Choose an option:',
        },
        accessory: {
          type: 'static_select',
          action_id: 'dropdown_select',
          options,
        },
      },
    ],
  });
});

// Handle dropdown selection
app.action('dropdown_select', async ({ ack, body, say }) => {
  await ack();
  const selectedOption = body.actions[0].selected_option.value;
  await say(`You selected: ${selectedOption}`);
});
