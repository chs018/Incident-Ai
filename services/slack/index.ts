/**
 * Slack Integration Service — AI Incident Commander
 *
 * Formats and sends rich Slack Block Kit notifications to engineering channels
 * when production incidents occur, when AI triage completes, or for status tests.
 */

export interface SlackNotificationPayload {
  title: string;
  message: string;
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success';
  service?: string;
  incidentId?: string;
  url?: string;
  fields?: Record<string, string>;
}

const severityColors: Record<string, string> = {
  critical: '#EF4444', // Red
  high: '#F97316',     // Orange
  medium: '#F59E0B',   // Amber
  low: '#10B981',      // Emerald
  info: '#3B82F6',     // Blue
  success: '#10B981',  // Emerald
};

const severityEmojis: Record<string, string> = {
  critical: '🚨',
  high: '🔥',
  medium: '⚠️',
  low: 'ℹ️',
  info: '💡',
  success: '✅',
};

export async function sendSlackNotification(payload: SlackNotificationPayload): Promise<{
  success: boolean;
  delivered: boolean;
  simulated?: boolean;
  error?: string;
  message?: string;
}> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const sev = payload.severity || 'info';
  const color = severityColors[sev] || '#3B82F6';
  const emoji = severityEmojis[sev] || '💡';

  // Construct rich Block Kit attachment format
  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${emoji} ${payload.title}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: payload.message,
      },
    },
  ];

  // Add field details if provided
  if (payload.fields && Object.keys(payload.fields).length > 0) {
    const fieldElements = Object.entries(payload.fields).map(([k, v]) => ({
      type: 'mrkdwn',
      text: `*${k}:*\n${v}`,
    }));

    // Group fields in pairs of 2 for clean Slack layout
    for (let i = 0; i < fieldElements.length; i += 2) {
      blocks.push({
        type: 'section',
        fields: fieldElements.slice(i, i + 2),
      });
    }
  }

  // Add action button if URL is provided
  if (payload.url) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Open Incident War Room',
            emoji: true,
          },
          url: payload.url,
          style: sev === 'critical' || sev === 'high' ? 'danger' : 'primary',
        },
      ],
    });
  }

  // Add context footer
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `⚡ *AI Incident Commander* · Runtime Intelligence governed by *cascadeflow™* · <http://localhost:3000/dashboard|Command Center>`,
      },
    ],
  });

  const slackMessage = {
    attachments: [
      {
        color,
        blocks,
      },
    ],
  };

  // If webhook is not configured or placeholder, simulate delivery cleanly
  if (!webhookUrl || !webhookUrl.startsWith('https://hooks.slack.com/')) {
    console.log('[Slack Integration] Simulated delivery (SLACK_WEBHOOK_URL not configured yet):', JSON.stringify(slackMessage, null, 2));
    return {
      success: true,
      delivered: false,
      simulated: true,
      message: 'SLACK_WEBHOOK_URL is not set in .env.local yet. Notification formatted successfully in simulation mode.',
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Slack Integration] Failed to send notification (${response.status}):`, errText);
      return { success: false, delivered: false, error: `Slack API error ${response.status}: ${errText}` };
    }

    console.log('[Slack Integration] Successfully delivered notification to Slack channel!');
    return { success: true, delivered: true, message: 'Notification delivered to Slack successfully!' };
  } catch (error: any) {
    console.error('[Slack Integration] Network error:', error);
    return { success: false, delivered: false, error: error.message };
  }
}

/**
 * Send a live test notification to verify Slack channel connectivity
 */
export async function sendSlackTestNotification(): Promise<any> {
  return sendSlackNotification({
    title: 'AI Incident Commander — Live Slack Integration Connected!',
    message: 'Hello *Harshini*! Your Slack integration is now live and communicating with *AI Incident Commander*. When production outages occur or when Groq completes an AI investigation, rich briefings and action items will be posted directly to *#new-channel*.',
    severity: 'success',
    fields: {
      'Environment': '`Production / LPU Cluster`',
      'AI Engine': '`Groq Llama 3.3 70B & Qwen 2.5`',
      'Status': '🟢 `Active & Monitored`',
      'Memory Layer': '`Hindsight pgvector Enabled`',
    },
    url: 'http://localhost:3000/dashboard',
  });
}
